const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;  // Change the port if necessary

// Middleware
app.use(bodyParser.json());

// MySQL Database Connection
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',  // Update with your MySQL user
    password: '',  // Update with your MySQL password
    database: 'glamour_nail_salon'  // Replace with your actual database name
});

db.connect((err) => {
    if (err) throw err;
    console.log('Connected to the database!');
});

// API endpoint to fetch services
app.get('/api/services', (req, res) => {
    const query = 'SELECT * FROM products';
    db.query(query, (err, results) => {
        if (err) {
            res.status(500).json({ message: 'Error fetching services', error: err });
        } else {
            res.json(results);
        }
    });
});

// API endpoint to fetch feedbacks
app.get('/api/feedbacks', (req, res) => {
    const query = 'SELECT * FROM feedback ORDER BY created_at DESC LIMIT 4';
    db.query(query, (err, results) => {
        if (err) {
            res.status(500).json({ message: 'Error fetching feedbacks', error: err });
        } else {
            res.json(results);
        }
    });
});

// API endpoint to handle booking (POST request)
app.post('/api/book-appointment', (req, res) => {
    const { name, email, message } = req.body;
    const bookingDate = new Date().toISOString().slice(0, 19).replace('T', ' ');
    const query = 'INSERT INTO bookings (name, email, message, booking_date, status) VALUES (?, ?, ?, ?, ?)';
    const values = [name, email, message, bookingDate, 'Pending'];

    db.query(query, values, (err, result) => {
        if (err) {
            res.status(500).json({ message: 'Error booking appointment', error: err });
        } else {
            res.json({ success: true, message: 'Appointment booked successfully!' });
        }
    });
});

// Start the server
app.listen(port, () => {
    console.log(`API server running on http://localhost:${port}`);
});
