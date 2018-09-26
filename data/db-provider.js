async function getDb() {
    const mongoClient = require('mongodb').MongoClient;
    const connectionString = 'mongodb://localhost:27017';
    try {
        const client = await mongoClient.connect(connectionString, { useNewUrlParser: true });
        const db = client.db('bookStore');
        return db;
    } catch (err) {
        throw new Error("Error in connecting to mongodb " + err);
    }
}

module.exports = getDb();
