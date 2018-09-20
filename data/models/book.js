const DataValidator = require('../validator');

module.exports = class Book {
    constructor(title, description, price, author, isbn, cover) {
        this.title = DataValidator.validateString(title, 1, 200);
        this.description = DataValidator.validateString(description, 30, 15000);
        this.price = DataValidator.validateNumber(price);
        this.author = DataValidator.validateBookAuthor(author);
        this.isbn = DataValidator.validateBookIsbn(isbn);
        this.cover = DataValidator.validateFile(cover);
        this.favorittedBy = [];
        this.purchasedBy = [];
    }
}