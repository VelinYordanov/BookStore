const DataValidator = require('../validator');

module.exports = class Author {
    constructor(name,bio,picture) {
        this.name = DataValidator.validateString(name, 4, 100);;
        this.bio = DataValidator.validateString(value,30,500);;
        this.picture = DataValidator.validateFile(picture);;
        this.books = [];
        this.favorittedBy = [];
    }
}