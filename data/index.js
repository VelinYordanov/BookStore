async function getData() {
    const db = await require('./db-provider');
    const BookData = require('./book-data');
    const AuthorData = require('./author-data');
    const UserData = require('./user-data');

    let users = new UserData(db.collection('users'));
    let authors = new AuthorData(db.collection('authors'));
    let books = new BookData(db.collection('books'));
    let BookStoreData = require('./book-store-data');

    return new BookStoreData(users, books, authors);
}

module.exports = getData();
