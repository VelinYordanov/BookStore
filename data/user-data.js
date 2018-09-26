const Data = require('./data');
const ObjectId = require('mongodb').ObjectId;

module.exports = class UserData extends Data {
    constructor(collection) {
        super(collection);
    }

    findUserByUsername(username) {
        return this.collection.findOne({ username: username });
    }

    addBookToPurchasedBooks(book, userId) {
        return this.collection.updateOne(
            { _id: ObjectId(userId) },
            { $addToSet: { purchasedBooks: book } }
        )
    }

    //Needs work
    addBookToFavorites(book, userId) {
        return this.collection.updateOne(
            { _id: ObjectId(userId) },
            { $addToSet: { favoriteBooks: book } }
        )
    }

    addAuthorToFavorites(author, userId) {
        return this.collection.updateOne(
            { _id: ObjectId(userId) },
            { $addToSet: { favoriteAuthors: author } }
        )
    }

    removeAuthorFromFavorites(author, userId) {
        return this.collection.updateOne(
            { _id: ObjectId(userId) },
            { $pull: { favoriteAuthors: author } }
        )
    }

    removeBookFromFavorites(book, userId) {
        return this.collection.updateOne(
            { _id: ObjectId(userId) },
            { $pull: { favoriteBooks: book } }
        )
    }
}