var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
mongoose.Promise = global.Promise;
var Message = require('../models/message');

// home page
router.get('/', (req, res) => {
    Message.find(function (err, results) {
		if (err) return console.error(err);
		var messageArray = [];
		results.forEach(function(item) {
			var x = JSON.parse(item.message);
			console.log(typeof x);
			console.log(x.Lyric);
			messageArray.push(x);
		}, this);
		res.render('index', {data: messageArray});
	});
});

module.exports = router;