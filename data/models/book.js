const DataValidator = require('../validator');

module.exports = class Book {
    constructor(title,description,price,author,isbn,cover) {
        this.title = title;
        this.description = description;
        this.price = price;
        this.author = author;
        this.isbn = isbn;
        this.cover = cover;
        this.favorittedBy = [];
        this.purchasedBy = [];
    }

    get title() {
        return this._title;
    }

    set title(value) {
        this._title = DataValidator(value,1,100);
    }

    get price() {
        return this._price;
    }

    set price(value) {
        if(!isNaN(parseFloat(value)) && isFinite(value)) {
            this._price - value;
        }

        throw new Error("Price must be a number");
    }

    get description() {
        return this._description;
    }

    set description(value) {
        this._description = DataValidator.validateString(value,30,500);
    }

    get author() {
        return this._author;
    }

    set author(value) {
        if(value.name && value.id) {
            this._author = value;
        }

        throw new Error("Author must be an object with id and name");
    }

    get favorittedBy() {
        return this._favorittedBy;
    }

    get purchasedBy() {
        return this._purchasedBy;
    }

    get isbn() {
        return this._isbn;
    }

    set isbn(value) {
        if(value.match(/(\d{10}|\d{13})$/)) {
            this._isbn = value;
        }

        throw new Error("Isbn must be 10 or 13 characters long and be all digits");
    }

    set cover(value) {
        this._cover = DataValidator.validateFile(value);
    }
}