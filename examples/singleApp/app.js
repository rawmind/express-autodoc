const express = require('express');
// eslint-disable-next-line no-unused-vars -- for testing purposess
const router = express.Router();

const app = express();

/**
 * Get song by ID
 */
app.get('/api/v1/song/:id', (_req, res) => (
  res.json({
    title: 'abum 1',
  })
));


/**
 * Updates a new song
 */
app.post('/api/v1/song/:id', (_req, res) => (
  res.json({
    title: 'abum 1',
  })
));

/**
 * Insert a new song
 */
app.put('/api/v1/song/:id/*', (_req, res) => (
  res.json({
    title: 'abum 1',
  })
));

module.exports = app;