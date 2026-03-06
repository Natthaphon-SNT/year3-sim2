const pool = require('../config/db.js');

module.exports = {
    async getFaculties() {
        const { rows } = await pool.query(`SELECT * FROM faculties ORDER BY faculty_id ASC`);
        return rows;
    },

    async getDepartments() {
        const query = `
            SELECT d.*, f.faculty_name 
            FROM departments d 
            JOIN faculties f ON d.faculty_id = f.faculty_id
            ORDER BY d.dept_id ASC
        `;
        const { rows } = await pool.query(query);
        return rows;
    },

    async getCourses() {
        const query = `
            SELECT c.*, d.name AS department_name 
            FROM courses c 
            JOIN departments d ON c.dept_id = d.dept_id
        `;
        const { rows } = await pool.query(query);
        return rows;
    },

    async enroll(userId, courseId, semester) {
        const query = `
            INSERT INTO enrollments (student_id, course_id, semester) 
            VALUES ((SELECT student_id FROM students WHERE user_id = $1), $2, $3) 
            RETURNING *
        `;
        const { rows } = await pool.query(query, [userId, courseId, semester]);
        return rows[0];
    },

    async getStudentSchedule(userId) {
        const query = `
            SELECT cs.*, c.course_code, c.title, p.first_name AS prof_name
            FROM class_schedules cs
            JOIN courses c ON cs.course_id = c.course_id
            JOIN enrollments e ON c.course_id = e.course_id
            JOIN students s ON e.student_id = s.student_id
            JOIN professors p ON cs.prof_id = p.prof_id
            WHERE s.user_id = $1
        `;
        const { rows } = await pool.query(query, [userId]);
        return rows;
    },

    async getStudentGrades(userId) {
        const query = `
            SELECT c.course_code, c.title, e.semester, e.grade
            FROM enrollments e
            JOIN courses c ON e.course_id = c.course_id
            JOIN students s ON e.student_id = s.student_id
            WHERE s.user_id = $1
        `;
        const { rows } = await pool.query(query, [userId]);
        return rows;
    },

    async getStudentExams(userId) {
        const query = `
            SELECT e.*, c.course_code, c.title
            FROM exam_schedules e
            JOIN courses c ON e.course_id = c.course_id
            JOIN enrollments en ON c.course_id = en.course_id
            JOIN students s ON en.student_id = s.student_id
            WHERE s.user_id = $1
        `;
        const { rows } = await pool.query(query, [userId]);
        return rows;
    },

    async getProfessorSchedule(userId) {
        const query = `
            SELECT cs.*, c.course_code, c.title 
            FROM class_schedules cs
            JOIN courses c ON cs.course_id = c.course_id
            JOIN professors p ON cs.prof_id = p.prof_id
            WHERE p.user_id = $1
        `;
        const { rows } = await pool.query(query, [userId]);
        return rows;
    },

    async getStudentsByCourse(courseId, profUserId) {
        const query = `
            SELECT e.enrollment_id, s.first_name, s.last_name, e.grade 
            FROM enrollments e
            JOIN students s ON e.student_id = s.student_id
            JOIN class_schedules cs ON e.course_id = cs.course_id
            JOIN professors p ON cs.prof_id = p.prof_id
            WHERE e.course_id = $1 AND p.user_id = $2
        `;
        const { rows } = await pool.query(query, [courseId, profUserId]);
        return rows;
    },

    async updateGrade(enrollmentId, grade) {
        const query = `UPDATE enrollments SET grade = $1 WHERE enrollment_id = $2 RETURNING *`;
        const { rows } = await pool.query(query, [grade, enrollmentId]);
        return rows[0];
    },

    async addOrUpdateExam(examData) {
        const query = `
            INSERT INTO exam_schedules (course_id, exam_type, exam_date, start_time, end_time, room_number) 
            VALUES ($1, $2, $3, $4, $5, $6) RETURNING *
        `;
        const { rows } = await pool.query(query, [
            examData.course_id, examData.exam_type, examData.exam_date, 
            examData.start_time, examData.end_time, examData.room_number
        ]);
        return rows[0];
    }
};