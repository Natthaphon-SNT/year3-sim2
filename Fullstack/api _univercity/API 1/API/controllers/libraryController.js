const Library = require('../models/library.js');

module.exports = {
    async getAllBooks(req, res) {
        try {
            const books = await Library.getBooks();
            res.json(books);
        } catch (err) {
            res.status(500).json({ error: 'Could not fetch books' });
        }
    },

    async borrowBook(req, res) {
        try {
            const studentId = await Library.getStudentIdByUserId(req.user.sub);
            if (!studentId) return res.status(403).json({ error: 'Only registered students can borrow.' });
            
            const record = await Library.createBorrowRecord(studentId, req.body.book_id);
            res.json({ message: 'Book borrowed successfully', data: record });
        } catch (err) {
            res.status(400).json({ error: err.message });
        }
    },

    async getMyLibraryHistory(req, res) {
        try {
            const history = await Library.getUserLibraryHistory(req.user.sub);
            res.json(history);
        } catch (err) {
            res.status(500).json({ error: 'Could not fetch library history' });
        }
    },

    // Staff / Admin Functions
    async adminBorrowBook(req, res) {
        try {
            const record = await Library.createBorrowRecord(req.body.student_id, req.body.book_id);
            res.json({ message: 'Staff: Book borrowed successfully for student', data: record });
        } catch (err) {
            res.status(400).json({ error: err.message });
        }
    },

    async adminProcessReturn(req, res) {
        try {
            const result = await Library.updateReturnStatus(req.body.record_id);
            res.json(result);
        } catch (err) {
            res.status(400).json({ error: err.message });
        }
    },

    async adminClearFine(req, res) {
        try {
            const result = await Library.payFine(req.body.record_id);
            res.json({ message: 'Fine cleared successfully', data: result });
        } catch (err) {
            res.status(400).json({ error: err.message });
        }
    },

    async adminGetAllLibraryStatus(req, res) {
        try {
            const status = await Library.getAllLibraryStatus();
            res.json(status);
        } catch (err) {
            res.status(500).json({ error: 'Could not fetch library status' });
        }
    },
    
    async adminAddBook(req, res) {
        try {
            const book = await Library.addBook(req.body);
            res.status(201).json({ message: 'Book added to library', data: book });
        } catch (err) {
            res.status(500).json({ error: 'Failed to add book' });
        }
    },

    async adminDeleteBook(req, res) {
        try {
            const deleted = await Library.deleteBook(req.params.id);
            if (!deleted) return res.status(404).json({ error: 'Book not found' });
            res.json({ message: 'Book deleted successfully', book: deleted });
        } catch (err) {
            res.status(500).json({ error: 'Failed to delete book' });
        }
    }
};