const Data = require('./data');

module.exports = class UserData extends Data {
    constructor(collection) {
        super(collection);
    }

    findUserByUsername(username) {
        return this.collection.findOne({ username: username });
    }

    addBookToPurchasedBooks(book, userId) {
        return this.collection.updateOne(
            { _id: userId },
            { $addToSet: { purchasedBooks: book } }
        )
    }

    addBookToFavorites(book, userId) {
        return this.collection.updateOne(
            { _id: userId },
            { $addToSet: { favoriteBooks: book } }
        )
    }

    addAuthorToFavorites(author, userId) {
        return this.collection.updateOne(
            { _id: userId },
            { $addToSet: { favoriteAuthors: author } }
        )
    }

    removeAuthorFromFavorites(author, userId) {
        return this.collection.updateOne(
            { _id: userId },
            { $pull: { favoriteAuthors: author } }
        )
    }

    removeBookFromFavorites(book, userId) {
        return this.collection.updateOne(
            { _id: userId },
            { $pull: { favoriteBooks: book } }
        )
    }
}