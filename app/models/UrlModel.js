var mongoose = require('mongoose');
mongoose.plugin(require('../../node_modules/mongoose-list'),{searchFields: ['hits']});

var urlSchema = mongoose.Schema({
	id: String,
	long: String,
	short: String,
	hits: Number
});

module.exports = mongoose.model('Url', urlSchema);