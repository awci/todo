var mongo = require('mongoose');

var schema = mongo.Schema;

var todoSchema = new schema({
	creator: { type: schema.Types.ObjectId, ref: 'User' },
	content: String,
	created: { type: Date, default: Date.now },
	diddate: { type: Date },
	status: { type: Number, default: 0 }
});

module.exports = mongo.model('Todo', todoSchema);