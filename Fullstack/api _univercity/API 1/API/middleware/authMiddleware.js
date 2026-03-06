const jwt = require('jsonwebtoken');
const secret = "12345"; 

const verifyToken = (req, res, next) => {
    const tokenHeader = req.headers['authorization'];
    if (!tokenHeader) return res.status(403).json({ error: "A token is required for authentication" });
    
    const parts = tokenHeader.split(" ");
    if (parts.length !== 2 || parts[0] !== "Bearer") {
        return res.status(401).json({ error: "Invalid Token Format. Use 'Bearer <token>'" });
    }

    try {
        const decoded = jwt.verify(parts[1], secret);
        req.user = decoded; 
    } catch (err) {
        return res.status(401).json({ error: "Invalid or Expired Token" });
    }
    return next();
};

const isAdmin = (req, res, next) => {
    if (req.user.role !== 'Admin') return res.status(403).json({ error: "Access denied. Admin only." });
    next();
};

const isStudent = (req, res, next) => {
    if (req.user.role !== 'Student') return res.status(403).json({ error: "Access denied. Student only." });
    next();
};

const isProfessor = (req, res, next) => {
    if (req.user.role !== 'Professor') return res.status(403).json({ error: "Access denied. Professor only." });
    next();
};

const isStaff = (req, res, next) => {
    if (req.user.role !== 'Staff') return res.status(403).json({ error: "Access denied. Staff only." });
    next();
};

const isAdminOrStaff = (req, res, next) => {
    if (req.user.role !== 'Admin' && req.user.role !== 'Staff') {
        return res.status(403).json({ error: "Access denied. Admin or Staff only." });
    }
    next();
};

module.exports = { verifyToken, isAdmin, isStudent, isProfessor, isStaff, isAdminOrStaff };