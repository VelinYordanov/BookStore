let db = require('./db-provider');
let Data = require('./data');

let users = new Data(db.collection('users'));
let authors = new Data(db.collection('authors'));
let books = new Data(db.collection('books'));
let BookStoreData = require('./book-store-data');

module.exports = new BookStoreData(users, books, authors);
