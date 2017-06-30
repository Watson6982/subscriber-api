var express = require('express');
var router = express.Router();

// home page
router.get('/', (req, res) => {
    res.send('Docs.');
});

module.exports = router;