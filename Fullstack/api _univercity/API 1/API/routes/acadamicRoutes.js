const express = require('express');
const router = express.Router();
const academicController = require('../controllers/academicController.js');
const { verifyToken, isStudent, isProfessor, isAdmin } = require('../middleware/authMiddleware.js');

// ทั่วไป
router.get('/structure', verifyToken, academicController.getStructure);
router.get('/courses', verifyToken, academicController.getAllCourses);

// Student
router.post('/student/enroll', verifyToken, isStudent, academicController.studentEnrollCourse);
router.get('/student/schedule', verifyToken, isStudent, academicController.getStudentSchedule);
router.get('/student/grades', verifyToken, isStudent, academicController.getStudentGrades);
router.get('/student/exams', verifyToken, isStudent, academicController.getStudentExams);

// Professor
router.get('/professor/schedule', verifyToken, isProfessor, academicController.getProfessorSchedule);
router.get('/professor/course/:course_id/students', verifyToken, isProfessor, academicController.getStudentsInCourse);
router.patch('/professor/grade', verifyToken, isProfessor, academicController.professorUpdateGrade);

// Admin
router.post('/admin/exams', verifyToken, isAdmin, academicController.adminManageExams);

module.exports = router;