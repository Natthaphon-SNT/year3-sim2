const express = require('express');
const app = express();
const cors = require('cors');
const PORT = process.env.PORT || 3000;

app.use(cors({ origin: 'http://localhost:4200' }));
app.use(express.json());

app.get('/', (req, res) => {
  res.json({ message: 'Welcome to University Management System API!' });
});

// Routes
const userRoutes = require('./routes/userRoutes.js');
const academicRoutes = require('./routes/acadamicRoutes.js');
const libraryRoutes = require('./routes/libraryRoutes.js');

app.use('/api/users', userRoutes);
app.use('/api/academic', academicRoutes);
app.use('/api/library', libraryRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on Localhost:${PORT}`);
});