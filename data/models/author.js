const DataValidator = require('../validator');

module.exports = class Author {
    constructor(name,bio,picture) {
        this.name = name;
        this.bio = bio;
        this.picture = picture;
        this.books = [];
        this.favorittedBy = [];
    }

    get name() {
        return this._name;
    }

    set name(value) {
        this._name = DataValidator.validateString(value, 4, 100);
    }

    get books() {
        return this._books;
    }

    get favorittedBy() {
        return this._favorittedBy;
    }

    set picture(value) {
        this._picture = DataValidator.validateFile(value);
    }

    get bio() {
        return this._bio;
    }

    set bio(value) {
        this._bio = DataValidator.validateString(value,30,500);
    }
}