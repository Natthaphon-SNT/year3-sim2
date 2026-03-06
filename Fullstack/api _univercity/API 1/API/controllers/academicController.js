const Academic = require('../models/acadamic.js');

module.exports = {
    // โครงสร้างมหาวิทยาลัย
    async getStructure(req, res) {
        try {
            const faculties = await Academic.getFaculties();
            const departments = await Academic.getDepartments();
            res.json({ faculties, departments });
        } catch (err) {
            res.status(500).json({ error: 'Could not fetch structure' });
        }
    },

    async getAllCourses(req, res) {
        try {
            const courses = await Academic.getCourses();
            res.json(courses);
        } catch (err) {
            res.status(500).json({ error: 'Could not fetch courses' });
        }
    },

    // Student
    async studentEnrollCourse(req, res) {
        try {
            await Academic.enroll(req.user.sub, req.body.course_id, req.body.semester);
            res.json({ message: 'Enrolled successfully' });
        } catch (err) {
            res.status(500).json({ error: 'Enrollment failed' });
        }
    },

    async getStudentSchedule(req, res) {
        try {
            const schedule = await Academic.getStudentSchedule(req.user.sub);
            res.json(schedule);
        } catch (err) {
            res.status(500).json({ error: 'Could not fetch schedule' });
        }
    },

    async getStudentGrades(req, res) {
        try {
            const grades = await Academic.getStudentGrades(req.user.sub);
            res.json(grades);
        } catch (err) {
            res.status(500).json({ error: 'Could not fetch grades' });
        }
    },

    async getStudentExams(req, res) {
        try {
            const exams = await Academic.getStudentExams(req.user.sub);
            res.json(exams);
        } catch (err) {
            res.status(500).json({ error: 'Could not fetch exams' });
        }
    },

    // Professor
    async getProfessorSchedule(req, res) {
        try {
            const schedule = await Academic.getProfessorSchedule(req.user.sub);
            res.json(schedule);
        } catch (err) {
            res.status(500).json({ error: 'Could not fetch teaching schedule' });
        }
    },

    async getStudentsInCourse(req, res) {
        try {
            const students = await Academic.getStudentsByCourse(req.params.course_id, req.user.sub);
            res.json(students);
        } catch (err) {
            res.status(500).json({ error: 'Could not fetch student list' });
        }
    },

    async professorUpdateGrade(req, res) {
        try {
            const { enrollment_id, grade } = req.body;
            const validGrades = ['A', 'B+', 'B', 'C+', 'C', 'D+', 'D', 'F', 'W', 'I'];
            if (!validGrades.includes(grade)) return res.status(400).json({ error: 'Invalid grade' });
            
            await Academic.updateGrade(enrollment_id, grade);
            res.json({ message: 'Grade updated successfully' });
        } catch (err) {
            res.status(500).json({ error: 'Failed to update grade' });
        }
    },

    // Admin
    async adminManageExams(req, res) {
        try {
            await Academic.addOrUpdateExam(req.body);
            res.json({ message: 'Exam schedule updated' });
        } catch (err) {
            res.status(500).json({ error: 'Failed to manage exams' });
        }
    }
};