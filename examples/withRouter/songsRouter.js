var express = require('express');
// eslint-disable-next-line no-unused-vars
const { Router } = require('express');


const router = express.Router();

/**
 * @description Get song by ID (router)
 * @pathParam (:id) The song id
 */
router.get('/song/:id', (_req, res) => (
  res.json({
    title: 'abum 1',
  })
));


/**
 * @description Updates a new song (router)
 * @pathParam (:id) The song id
 */
router.post('/song/:id', (_req, res) => (
  res.json({
    title: 'abum 1',
  })
));
//extra comment
/**
 * @description Insert a new song (router)
 * @pathParam (:id) The song id
 */
router.put('/song/:id/*', (_req, res) => (
  res.json({
    title: 'abum 1',
  })
));

module.exports = router;