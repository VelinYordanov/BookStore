const DataValidator = require('../validator');
const fs = require('fs');
const path = require('path');
const defaultAvatar = getDefaultUserImage();

module.exports = class User {
    constructor(username, password, repeatPassword, crypto) {
        this.username = DataValidator.validateString(username, 5, 50);
        this.createPassword(password, repeatPassword, crypto);
        this.avatar = defaultAvatar;
        this.commentedBooks = [];
        this.purchasedBooks = [];
        this.favoriteBooks = [];
        this.favoriteAuthors = [];
    }

    createPassword(password, repeatPassword, crypto) {
        if (DataValidator.validateString(password, 5, 50) === repeatPassword) {
            this.salt = crypto.generateSalt();
            this.password = crypto.generateHashedPassword(this.salt, password);
        }
    }
}

function getDefaultUserImage() {
    return fs.readFileSync(path.resolve(__dirname, '../../public/images/default-avatar.png'));
}