const express = require('express');
const router = express.Router();

/**
 * @route   GET api/post/test
 * @desc    Test Post route
 * @access  Public
 */
router.get('/test', (req, res) => res.json({msg: 'PostRouter Works'}));

module.exports = router;