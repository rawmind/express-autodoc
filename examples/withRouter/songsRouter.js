var express = require('express');
// eslint-disable-next-line no-unused-vars
const { Router } = require('express');


const router = express.Router();

/**
 * @description Get song by ID (router)
 */
router.get('/song/:id', (_req, res) => (
  res.json({
    title: 'abum 1',
  })
));


/**
 * @description Updates a new song (router)
 */
router.post('/song/:id', (_req, res) => (
  res.json({
    title: 'abum 1',
  })
));
//extra comment
/**
 * @description Insert a new song (router)
 */
router.put('/song/:id/*', (_req, res) => (
  res.json({
    title: 'abum 1',
  })
));

module.exports = router;