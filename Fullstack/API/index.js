const express = require('express');
const { body, validationResult } = require('express-validator');
const app = express();
const port = 3000;
const cors = require('cors');
const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');


app.use(express.json());
app.use(cors());

app.get('/api/hello/:name', (req, res) => {
  const name = req.params.name;
  res.json({ message: `Hello ${name}!`, age: req.query.age || null });
});

var employees = [];

app.post('/api/employees', [
    body('name').isLength({ min: 2, max: 20 }).withMessage('Name must be between 2 and 20 characters'),
    body('age').isInt({ min: 0, max: 120 }).withMessage('Age must be a positive integer'),
], (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const employee = {
    id: employees.length > 0 ? Math.max(...employees.map(e => e.id)) + 1 : 1,
    ...req.body
  };
  employees.push(employee);
  res.status(201).json({ message: 'Employee created successfully', employee });
});

app.put('/api/employees/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const updatedEmployee = req.body;
  const index = employees.findIndex(emp => emp.id === id);
    if (index !== -1) {
    employees[index] = updatedEmployee;
    res.json({ message: 'Employee updated successfully', employee: updatedEmployee });
  } else {
    res.status(404).json({ message: 'Employee not found' });
  }
});

/**
 * @swagger
 * /api/employees/{id}:
 * delete:
 * summary: Delete an employee by ID
 * parameters:
 * - in: path
 * name: id
 * required: true
 * description: Numeric ID of the employee to delete
 * schema:
 * type: integer
 * responses:
 * 200:
 * description: Employee deleted successfully
 * 404:
 * description: Employee not found
 */

app.delete('/api/employees/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const index = employees.findIndex(emp => emp.id === id);
  if (index !== -1) {
    employees.splice(index, 1);
    res.json({ message: 'Employee deleted successfully' });
  } else {
    res.status(404).json({ message: 'Employee not found' });
  }
});

app.patch('/api/employees/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const updates = req.body;
  const index = employees.findIndex(emp => emp.id === id);
  if (index !== -1) {
    employees[index] = { ...employees[index], ...updates };
    res.json({ message: 'Employee updated successfully', employee: employees[index] });
  } else {
    res.status(404).json({ message: 'Employee not found' });
  }
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  throw new Error('Internal server went wrong!');
});

app.get('/api/testerror', (req, res) => {
  res.send('Welcome to the Employee Management API');
});


const swaggerOptions = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Products Management API',
            version: '1.0.0',
            description: 'API for managing products',
        },
        servers: [
            { url: `http://localhost:${port}` },
        ],
    },
    apis: ['./index.js'],
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Internal server error' });
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
  console.log(`Swagger Docs available at http://localhost:${port}/api-docs`);
});