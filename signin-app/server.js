const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql2');
const cors = require('cors');
const app = express();

app.use(cors({ origin: '*' })); // Allow requests from all origins
app.use(bodyParser.json());

// Connect to MySQL Database
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '1234',
  database: 'user_db'
});

process.on('uncaughtException', (err) => {
  console.error('There was an uncaught error', err);
  process.exit(1); // Force exit to prevent unstable state
});
db.connect(err => {
  if (err) {
    console.error('Database connection failed:', err);
    return;
  }
  console.log('Connected to Database');
});


db.connect(err => {
  if (err) {
    console.error('Database connection failed:', err);
    process.exit(1); // Exit application if DB fails to connect
  }
  console.log('Connected to Database');
});

// Sign-in Route
app.post('/signin', (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).send({ message: "Email and password are required." });
  }

  const query = `SELECT * FROM users WHERE email = ? AND password = ?`;
  db.query(query, [email, password], (err, result) => {
    if (err) {
      return res.status(500).send({ message: "Database error" });
    }

    if (result.length > 0) {
      res.send({ message: "Sign-in successful", user: result[0] });
    } else {
      res.status(401).send({ message: "Invalid email or password" });
    }
  });
});

app.listen(2000, () => {
  console.log('Server running on port 5000');
});
