var express = require('express');
// eslint-disable-next-line no-unused-vars
const { Router } = require('express');


const router = express.Router();

/**
 * Get song by ID (router)
 */
router.get('/song/:id', (_req, res) => (
  res.json({
    title: 'abum 1',
  })
));


/**
 * Updates a new song (router)
 */
router.post('/song/:id', (_req, res) => (
  res.json({
    title: 'abum 1',
  })
));
//qwqw
/**
 * Insert a new song (router)
 */
router.put('/song/:id/*', (_req, res) => (
  res.json({
    title: 'abum 1',
  })
));

module.exports = router;