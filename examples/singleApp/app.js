const express = require('express');
// eslint-disable-next-line no-unused-vars -- for testing purposess
const router = express.Router();

const app = express();

/**
 * @description Get songs
 * @queryParam (title) {type: string, required: true, default: Sad but true} The song title
 * @produces application/json, application/xml
 */
app.get('/api/v1/songs', (req, res) => (
  res.json({
    title: req.title,
  })
));

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
 * @description Updates a new song
 * @body {"json": "body"}
 */
app.post('/api/v1/song-json', (_req, res) => (
  res.json({
    title: 'abum 1',
  })
));

/**
 *  @description Updates a new song
 *  @pathParam (:id) The song id
 */
app.put('/api/v1/song/:id/*', (_req, res) => (
  res.json({
    title: 'abum 1',
  })
));

/**
 *  @description Partial updates for a song
 *  @pathParam (:id) The song id
 */
app.patch('/api/v1/song/:id/*', (_req, res) => (
  res.json({
    title: 'abum 1',
  })
));

/**
 *  @description Some other stuff (trace)
 *  @pathParam (:id) The song id
 */
app.trace('/api/v1/song/:id/*', (_req, res) => (
  res.json({
    title: 'abum 1',
  })
));

/**
 *  @description Some other stuff (head)
 *  @pathParam (:id) The song id
 */
app.head('/api/v1/song/:id/*', (_req, res) => (
  res.json({
    title: 'abum 1',
  })
));

/**
 * @operationId updateSong
 * @description Updates a new song
 * @body #/definitions/Song
 * @response #/definitions/Song
 */
app.post('/api/v3/song-json', (_req, res) => (
  res.json({
    title: 'abum 1',
  })
));


module.exports = app;