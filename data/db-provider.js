var mongoClient = require('mongodb').MongoClient;

const connectionString = 'mongodb://localhost:27017';
try {
    module.exports = (await mongoClient.connect(connectionString)).db('bookStore');
} catch {
    throw new Error("Error in connecting to mongodb " + err);
}