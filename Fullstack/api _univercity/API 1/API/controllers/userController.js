const User = require('../models/user.js');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const secret = "12345";

module.exports = {
    async login(req, res) {
        const { username, password_secure } = req.body;
        try {
            const hashedPassword = crypto.createHash('md5').update(password_secure).digest('hex');
            const user = await User.login(username, hashedPassword);

            if (!user) return res.status(400).json({ error: 'Invalid credentials or inactive user' });

            const token = jwt.sign(
                { sub: user.user_id, username: user.username, role: user.role_name },
                secret,
                { expiresIn: '2h' }
            );

            res.json({ access_token: token, role: user.role_name });
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: 'Login failed' });
        }
    },

    async getMyProfile(req, res) {
        try {
            const profile = await User.getProfileFromView(req.user.sub);
            res.json(profile);
        } catch (err) {
            res.status(500).json({ error: 'Could not fetch profile' });
        }
    },

    async adminGetAllUsers(req, res) {
        try {
            const users = await User.getAllUsers();
            res.json(users);
        } catch (err) {
            res.status(500).json({ error: 'Internal server error' });
        }
    },

    async adminUpdateUser(req, res) {
        try {
            const { id } = req.params;
            await User.updateUser(id, req.body);
            res.json({ message: 'User updated successfully' });
        } catch (err) {
            res.status(500).json({ error: 'Update failed' });
        }
    }
};