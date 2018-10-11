async function getDb() {
    const mongoClient = require('mongodb').MongoClient;
    const connectionString = process.env.NODE_ENV === "production" ? `mongodb://${process.env.BookStoreUser}:${process.env.BookStorePassword}@ds237072.mlab.com:37072/book-store-db` : 'mongodb://localhost:27017/book-store-db';
    try {
        const client = await mongoClient.connect(connectionString, { useNewUrlParser: true });
        const db = client.db('book-store-db');
        return db;
    } catch (err) {
        throw new Error("Error in connecting to mongodb " + err);
    }
}

module.exports = getDb();
