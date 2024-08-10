const express = require('express');
const app = express();
const path = require('path');
const morgan = require('morgan');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const compression = require('compression');
const { body, validationResult } = require('express-validator');
const port = process.env.PORT || 3000;

// Hello World Route
app.get('/hello', (req, res) => {
  res.send('Hello, Express!');
});

// Goodbye Route
app.get('/goodbye', (req, res) => {
  res.send('Goodbye, Express!');
});

// Echo Route
app.post('/echo', (req, res) => {
  res.json(req.body);
});

// Greet User with Query
app.get('/greet', (req, res) => {
  const name = req.query.name || 'Guest';
  res.send(`Hello, ${name}!`);
});

// Greet User with URL Parameter
app.get('/greet/:name', (req, res) => {
  const name = req.params.name;
  res.send(`Hello, ${name}!`);
});

// User Info with ID
app.get('/user/:id', (req, res) => {
  const id = req.params.id;
  res.send(`User ID: ${id}`);
});

// Static File Serving
app.use(express.static(path.join(__dirname, 'public')));


// Send JSON Response
app.get('/json', (req, res) => {
  res.json({ message: 'Hello, world!' });
});

// Handle JSON Payload
app.post('/handle-json', (req, res) => {
  res.json({ received: req.body });
});

// Add PUT Route
app.put('/update', (req, res) => {
  res.send('Data updated');
});

// Add DELETE Route
app.delete('/delete/:id', (req, res) => {
  const id = req.params.id;
  res.send(`Deleted item with ID: ${id}`);
});

// Log Requests Middleware
app.use((req, res, next) => {
    console.log(`Request Method: ${req.method}, URL: ${req.url}`);
    next();
  });

  // Basic Error Handling
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
  });

// Send HTML Response
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/index.html'));
  });

// Middleware for logging, JSON and URL-encoded body parsing, compression, and CORS
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(compression());
app.use(cors());

// Rate Limiting Middleware
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, 
    max: 100, 
  });
 app.use(limiter);

// Data Validation
app.post(
    '/validate',
    body('email').isEmail(),
    body('password').isLength({ min: 5 }),
    (req, res) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      res.send('Validation passed');
    }
  );

// Handle URL Encoded Data
app.post('/handle-urlencoded', (req, res) => {
  res.json({ received: req.body });
});

// JSON Response from GET
app.get('/get-json', (req, res) => {
  res.json({ data: 'This is a JSON response' });
});

// Redirect Route
app.get('/redirect', (req, res) => {
  res.redirect('/hello');
});



// 404 Error Handling
app.use((req, res, next) => {
  res.status(404).send('404 - Not Found');
});


// Send Status Code
app.get('/status', (req, res) => {
  res.status(201).send('Created');
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

