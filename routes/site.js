var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
mongoose.Promise = global.Promise;
var Message = require('../models/message');

// home page
router.get('/', (req, res) => {
    Message.find(function (err, messages) {
		if (err) return console.error(err);
		res.render('index', {data: messages});
	});
});

module.exports = router;