var mongoose = require('mongoose');

var keySchema = mongoose.Schema({
	id: String,
	value: Number
});

module.exports = mongoose.model('Key', keySchema);