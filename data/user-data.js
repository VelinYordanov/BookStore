const Data = require('./data');

module.exports = class UserData extends Data {
    constructor(collection) {
        super(collection);
    }

    findUserByUsername(username) {
        return this.collection.findOne({ _username: username });
    }

    addBookToPurchasedBooks(book, userId) {
        return this.collection.update(
            { _id: userId },
            { $addToSet: { purchasedBooks: book } }
        )
    }

    addBookToFavorites(book, userId) {
        return this.collection.update(
            { _id: userId },
            { $addToSet: { favoriteBooks: book } }
        )
    }

    addAuthorToFavorites(author, userId) {
        return this.collection.update(
            { _id: userId },
            { $addToSet: { favoriteAuthors: author } }
        )
    }
}