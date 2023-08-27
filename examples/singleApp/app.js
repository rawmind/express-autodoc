const express = require('express');
// eslint-disable-next-line no-unused-vars -- for testing purposess
const router = express.Router();

const app = express();

/**
 * @description Get song by ID
 * @pathParam (:id) The song id
 */
app.get('/api/v1/song/:id', (_req, res) => (
  res.json({
    title: 'abum 1',
  })
));


/**
 * @description Updates a new song
 * @pathParam (:id) The song id
 */
app.post('/api/v1/song/:id', (_req, res) => (
  res.json({
    title: 'abum 1',
  })
));

/**
 *  @description Insert a new song
 *  @pathParam (:id) The song id
 */
app.put('/api/v1/song/:id/*', (_req, res) => (
  res.json({
    title: 'abum 1',
  })
));

module.exports = app;