// Import necessary packages
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const sqlite3 = require('sqlite3').verbose();

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// SQLite database setup
const db = new sqlite3.Database('./expense-tracker.db', (err) => {
    if (err) {
        console.error(err.message);
    }
    console.log('Connected to the expense-tracker database.');
});

// Create tables if they do not exist
db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL
    )`);

    db.run(`CREATE TABLE IF NOT EXISTS transactions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        type TEXT NOT NULL,
        category TEXT NOT NULL,
        amount REAL NOT NULL,
        date TEXT NOT NULL,
        description TEXT
    )`);
});

// Secret key for JWT
const JWT_SECRET = 'EXPENSE';

// User registration
app.post('/register', async (req, res) => {
    const { username, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    db.run(`INSERT INTO users (username, password) VALUES (?, ?)`, [username, hashedPassword], function (err) {
        if (err) {
            return res.status(400).send('User already exists');
        }
        res.status(201).send('User registered successfully');
    });
});

// User login
app.post('/login', async (req, res) => {
    const { username, password } = req.body;

    db.get(`SELECT * FROM users WHERE username = ?`, [username], async (err, user) => {
        if (err || !user) {
            return res.status(400).send('Invalid username or password');
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(400).send('Invalid username or password');
        }

        const token = jwt.sign({ username }, JWT_SECRET);
        res.json({ token });
    });
});

// Middleware for JWT verification
const authenticateJWT = (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1];
    if (!token) return res.sendStatus(403);

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) return res.sendStatus(403);
        req.user = user;
        next();
    });
};

// 1. Add a new transaction
app.post('/transactions', authenticateJWT, (req, res) => {
    const { type, category, amount, date, description } = req.body;

    // Input validation
    if (!type || !category || !amount || !date) {
        return res.status(400).send('All fields are required');
    }

    db.run(`INSERT INTO transactions (type, category, amount, date, description) VALUES (?, ?, ?, ?, ?)`,
        [type, category, amount, date, description], function (err) {
            if (err) {
                return res.status(400).send('Error adding transaction');
            }
            res.status(201).json({ id: this.lastID, type, category, amount, date, description });
        });
});

// 2. Get all transactions
app.get('/transactions', authenticateJWT, (req, res) => {
    db.all(`SELECT * FROM transactions`, [], (err, rows) => {
        if (err) {
            return res.status(500).send('Error retrieving transactions');
        }
        res.json(rows);
    });
});

// 3. Get a transaction by ID
app.get('/transactions/:id', authenticateJWT, (req, res) => {
    const { id } = req.params;
    db.get(`SELECT * FROM transactions WHERE id = ?`, [id], (err, row) => {
        if (err || !row) {
            return res.status(404).send('Transaction not found');
        }
        res.json(row);
    });
});

// 4. Update a transaction by ID
app.put('/transactions/:id', authenticateJWT, (req, res) => {
    const { id } = req.params;
    const { type, category, amount, date, description } = req.body;

    // Input validation
    if (!type || !category || !amount || !date) {
        return res.status(400).send('All fields are required');
    }

    db.run(`UPDATE transactions SET type = ?, category = ?, amount = ?, date = ?, description = ? WHERE id = ?`,
        [type, category, amount, date, description, id], function (err) {
            if (err || this.changes === 0) {
                return res.status(404).send('Transaction not found');
            }
            res.send('Transaction updated');
        });
});

// 5. Delete a transaction by ID
app.delete('/transactions/:id', authenticateJWT, (req, res) => {
    const { id } = req.params;

    db.run(`DELETE FROM transactions WHERE id = ?`, [id], function (err) {
        if (err || this.changes === 0) {
            return res.status(404).send('Transaction not found');
        }
        res.send('Transaction deleted');
    });
});

// 6. Get transaction summary
app.get('/summary', authenticateJWT, (req, res) => {
    db.all(`SELECT type, SUM(amount) as total FROM transactions GROUP BY type`, [], (err, rows) => {
        if (err) {
            return res.status(500).send('Error retrieving summary');
        }

        const summary = {
            totalIncome: rows.find(row => row.type === 'income')?.total || 0,
            totalExpense: rows.find(row => row.type === 'expense')?.total || 0,
            balance: (rows.find(row => row.type === 'income')?.total || 0) - (rows.find(row => row.type === 'expense')?.total || 0),
        };
        res.json(summary);
    });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

module.exports = app; // Export for testing purposes
