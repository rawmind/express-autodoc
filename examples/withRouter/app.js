const express = require('express');
const app = express();
const songsRouter = require('./songsRouter');

/**
 * Get song by ID
 */
app.get('/api/v1/song/:id', (_req, res) => (
  res.json({
    title: 'abum 1',
  })
));

app.use('/songs', songsRouter); // app.use(/path/ , route)
app.use('/v2/api/songs', songsRouter)

// eslint-disable-next-line no-unused-vars
app.use(function (err, req, res, _next) {
});

// eslint-disable-next-line no-unused-vars
app.use(function (req, res, _next) {
});


module.exports = app;