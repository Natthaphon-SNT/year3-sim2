const express = require('express');
const router = express.Router();
const libraryController = require('../controllers/libraryController.js');
const { verifyToken, isStudent, isAdminOrStaff } = require('../middleware/authMiddleware.js');

router.get('/books', verifyToken, libraryController.getAllBooks);

// Student
router.post('/borrow', verifyToken, isStudent, libraryController.borrowBook);
router.get('/my-history', verifyToken, isStudent, libraryController.getMyLibraryHistory);

// Admin & Staff (เปลี่ยนจาก isAdmin เป็น isAdminOrStaff)
router.post('/manage/borrow', verifyToken, isAdminOrStaff, libraryController.adminBorrowBook); 
router.post('/manage/return', verifyToken, isAdminOrStaff, libraryController.adminProcessReturn); 
router.post('/manage/clear-fine', verifyToken, isAdminOrStaff, libraryController.adminClearFine); 
router.get('/manage/status', verifyToken, isAdminOrStaff, libraryController.adminGetAllLibraryStatus); 
router.post('/manage/books', verifyToken, isAdminOrStaff, libraryController.adminAddBook); 
router.delete('/manage/books/:id', verifyToken, isAdminOrStaff, libraryController.adminDeleteBook); 

module.exports = router;