async function getData() {
    let db = await require('./db-provider');
    let Data = require('./data');
    let BookData = require('./book-data');
    let AuthorData = require('./author-data');

    let users = new Data(db.collection('users'));
    let authors = new AuthorData(db.collection('authors'));
    let books = new BookData(db.collection('books'));
    let BookStoreData = require('./book-store-data');

    return new BookStoreData(users, books, authors);
}

module.exports = getData();
