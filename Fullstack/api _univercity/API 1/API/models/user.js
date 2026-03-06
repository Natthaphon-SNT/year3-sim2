const pool = require('../config/db.js');

module.exports = {
    async login(username, password_secure) {
        const query = `
    SELECT u.user_id, u.username, u.password_secure, r.role_name 
    FROM users u 
    JOIN roles r ON u.role_id = r.role_id 
    WHERE u.username = $1 AND u.password_secure = $2
`;
        const { rows } = await pool.query(query, [username, password_secure]);
        return rows[0];
    },

    async getProfileFromView(userId) {
        const query = `SELECT * FROM v_user_profiles WHERE user_id = $1`;
        const { rows } = await pool.query(query, [userId]);
        return rows[0];
    },

    async getAllUsers() {
        const query = `SELECT * FROM v_user_profiles ORDER BY user_id ASC`;
        const { rows } = await pool.query(query);
        return rows;
    },

    async updateUser(userId, data) {
        const query = `UPDATE users SET email = $1, is_active = $2 WHERE user_id = $3 RETURNING *`;
        const { rows } = await pool.query(query, [data.email, data.is_active, userId]);
        return rows[0];
    }
};