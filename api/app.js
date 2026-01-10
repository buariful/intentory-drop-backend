const express = require('express');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.json());

app.get('/api/health', (_, res) => {
  res.json({ status: 'ok' });
});

app.use('/api/drops', require('./routes/dropRoute'));
app.use('/api/auth', require('./routes/authRoute'));

module.exports = app;
