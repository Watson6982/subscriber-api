var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Message = new Schema({
	messageId: String,
	message: String,
	updated: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Message', Message);