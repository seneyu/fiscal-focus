const express = require('express');
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

app.listen(PORT, () => {
  console.log(`Server is listening on http://localhost:${PORT}...`);
});
