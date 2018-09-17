const DataValidator = require('../validator');

module.exports = class User {
    constructor(username, password, repeatPassword, crypto) {
        this.username = DataValidator.validateString(username, 5, 50);
        this.createPassword(password, repeatPassword, crypto);
        this.purchasedBooks = [];
        this.favoritedBooks = [];
        this.favoritedAuthors = [];
    }

    createPassword(password, repeatPassword, crypto) {
        if (DataValidator.validateString(password, 5, 50) === repeatPassword) {
            this.salt = crypto.generateSalt();
            this.password = crypto.generateHashedPassword(this.salt, password);
        }
    }
}