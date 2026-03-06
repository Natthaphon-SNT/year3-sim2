const pool = require('../config/db.js');

module.exports = {
    async getBooks() {
        const { rows } = await pool.query(`SELECT * FROM books ORDER BY title ASC`);
        return rows;
    },

    async getStudentIdByUserId(userId) {
        const { rows } = await pool.query('SELECT student_id FROM students WHERE user_id = $1', [userId]);
        return rows.length ? rows[0].student_id : null;
    },

    async createBorrowRecord(studentId, bookId) {
        const client = await pool.connect();
        try {
            await client.query('BEGIN');
            
            const checkRes = await client.query(`SELECT available_copies FROM books WHERE book_id = $1 FOR UPDATE`, [bookId]);
            if (checkRes.rows.length === 0) throw new Error('ไม่พบหนังสือในระบบ');
            if (checkRes.rows[0].available_copies <= 0) throw new Error('หนังสือเล่มนี้ถูกยืมหมดแล้ว');

            const settingRes = await client.query(`SELECT max_days_limit FROM library_settings LIMIT 1`);
            const maxDays = settingRes.rows.length > 0 ? settingRes.rows[0].max_days_limit : 7;

            const insertQuery = `
                INSERT INTO library_records (student_id, book_id, borrow_date, due_date)
                VALUES ($1, $2, CURRENT_DATE, CURRENT_DATE + $3::int) 
                RETURNING *
            `;
            const { rows } = await client.query(insertQuery, [studentId, bookId, maxDays]);
            
            await client.query(`UPDATE books SET available_copies = available_copies - 1 WHERE book_id = $1`, [bookId]);
            
            await client.query('COMMIT');
            return rows[0];
        } catch (e) {
            await client.query('ROLLBACK');
            throw e;
        } finally {
            client.release();
        }
    },

    async updateReturnStatus(recordId) {
        const client = await pool.connect();
        try {
            await client.query('BEGIN');
            const checkRes = await client.query(`SELECT book_id, return_date FROM library_records WHERE record_id = $1 FOR UPDATE`, [recordId]);

            if (checkRes.rows.length === 0) throw new Error('ไม่พบรายการยืมนี้ในระบบ');
            if (checkRes.rows[0].return_date !== null) throw new Error('หนังสือเล่มนี้ถูกคืนไปเรียบร้อยแล้ว');

            const bookId = checkRes.rows[0].book_id;

            const updateQuery = `UPDATE library_records SET return_date = CURRENT_DATE WHERE record_id = $1 RETURNING *`;
            const updatedRecord = await client.query(updateQuery, [recordId]);
            
            await client.query(`UPDATE books SET available_copies = available_copies + 1 WHERE book_id = $1`, [bookId]);
            
            await client.query('COMMIT');
            return { 
                success: true, 
                message: 'คืนหนังสือสำเร็จ', 
                fine_amount: updatedRecord.rows[0].fine_amount,
                status: updatedRecord.rows[0].status
            };
        } catch (e) {
            await client.query('ROLLBACK');
            throw e; 
        } finally {
            client.release();
        }
    },

    async payFine(recordId) {
        const query = `
            UPDATE library_records 
            SET fine_amount = 0, status = 'Returned (Fine Paid)' 
            WHERE record_id = $1 AND return_date IS NOT NULL 
            RETURNING *
        `;
        const { rows } = await pool.query(query, [recordId]);
        if (rows.length === 0) throw new Error('ไม่สามารถชำระค่าปรับได้ (อาจยังไม่คืนหนังสือ หรือไม่มีรายการนี้)');
        return rows[0];
    },

    async getUserLibraryHistory(userId) {
        const query = `
            SELECT v.* FROM v_library_status v
            JOIN library_records lr ON v.record_id = lr.record_id
            JOIN students s ON lr.student_id = s.student_id
            WHERE s.user_id = $1
            ORDER BY lr.borrow_date DESC
        `;
        const { rows } = await pool.query(query, [userId]);
        return rows;
    },

    async getAllLibraryStatus() {
        const { rows } = await pool.query(`SELECT * FROM v_library_status ORDER BY borrow_date DESC`);
        return rows;
    },

    async addBook(bookData) {
        const query = `
            INSERT INTO books (isbn, title, author, total_copies, available_copies) 
            VALUES ($1, $2, $3, $4, $5) RETURNING *
        `;
        const { rows } = await pool.query(query, [bookData.isbn, bookData.title, bookData.author, bookData.total_copies, bookData.available_copies]);
        return rows[0];
    },

    async deleteBook(bookId) {
        const { rows } = await pool.query(`DELETE FROM books WHERE book_id = $1 RETURNING *`, [bookId]);
        return rows[0];
    }
};