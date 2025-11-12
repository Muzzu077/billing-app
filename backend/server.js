require('dotenv').config();

const app = require('./app');

const PORT = process.env.PORT || 5000;

if (process.env.NODE_ENV === 'production' && !process.env.VERCEL) {
  const path = require('path');
  const express = require('express');
  app.use(express.static(path.join(__dirname, '../frontend/dist')));
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/dist/index.html'));
  });
}

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});