const express = require('express');
const db = require('./model/model');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.get('/', (req, res) => {
  res.status(200);
  res.send('Hello from the Server!');
});

app.post('/api/login', (req, res) => {
  res.status(200).json({ message: 'Login route connected!' });
});

const connectDatabse = async () => {
  try {
    await db.query('SELECT NOW()');
    console.log('Database connected successfully');
  } catch (error) {
    console.error('Error connecting to the database: ', error);
  }
};

app.listen(PORT, () => {
  console.log(`Server is listening on http://localhost:${PORT}...`);
  connectDatabse();
});
