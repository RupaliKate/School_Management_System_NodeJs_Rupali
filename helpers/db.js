const mongodb = require('mongodb');
require('dotenv').config()

const MongoClient = mongodb.MongoClient;

let _db;

const mongoUrl = `mongodb+srv://Rupali:Rupali1993@cluster0.bwdnbkm.mongodb.net/?retryWrites=true&w=majority`;

exports.initDb = async cb => {
	if (_db) 
		return cb(null, _db);

	try {
		const client = await MongoClient.connect(mongoUrl, { useUnifiedTopology: true });
		_db = client.db();
		cb(null, client);
	} catch (error) {
		cb(error, null);
	}
};

exports.getDb = () => {
	if (!_db) throw 'Not Connected...';

	return _db;
};
