const express = require('express');
const mysql = require('mysql');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // To parse form data
app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs');
app.use('/uploads', express.static(path.join(__dirname, 'public/uploads')));

// Database Connection
const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME
});

db.connect(err => {
    if (err) throw err;
    console.log('✅ MySQL Connected...');
});

// Home Route
app.get('/', (req, res) => {
    db.query('SELECT * FROM projects', (err, projects) => {
        if (err) {
            console.error("Error fetching projects:", err);
            return res.status(500).send("Database error");
        }

        db.query('SELECT * FROM Skills_personal', (err, skills) => {
            if (err) {
                console.error("Error fetching skills:", err);
                return res.status(500).send("Database error");
            }

            // Modify image paths if they are stored as relative paths
            projects = projects.map(project => {
                if (!project.image_url.startsWith('http')) {
                    project.image_url = `/uploads/${project.image_url}`;
                }
                // console.log("Image URL:", project.image_url); // Debugging log
                return project;
            });

            res.render('index', { projects, skills });
        });
    });
});

app.get('/skills', (req, res) => {
    db.query('SELECT * FROM skills', (err, results) => {
        if (err) return res.status(500).json({ error: 'Database error' });
        res.json(results);
    });
});

app.get('/projects', (req, res) => {
    db.query('SELECT * FROM projects', (err, results) => {
        if (err) return res.status(500).json({ error: 'Database error' });
        res.json(results);
    });
});


// 📌 Contact Form Submission Route
app.post('/contact', (req, res) => {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    const query = "INSERT INTO contact_us (name, email, message) VALUES (?, ?, ?)";
    db.query(query, [name, email, message], (err, result) => {
        if (err) {
            console.error("Error inserting data:", err);
            return res.status(500).json({ error: 'Database error' });
        }
        res.json({ success: 'Message received!' });
    });
});

// Start Server
app.listen(5000, () => console.log('🚀 Server running on port 5000'));
