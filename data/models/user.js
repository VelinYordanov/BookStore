class User {
    constructor(userName, salt, password, avatar) {
        this.userName = userName;
        this.salt = salt;
        this.password = password;
        this.avatar = avatar;
        this._purchasedBooks = [];
        this._favoritedBooks = [];  
        this._favoritedAuthors = [];    
    }

    get userName() {
        return this._userName;
    }

    set userName(value) {
        this._userName = DataValidator.validateString(value,5,50);
    }

    get purchasedBooks() {
        return this._purchasedBooks;
    }

    get favoritedBooks() {
        return this._favoritedBooks;
    }

    get favoritedAuthors() {
        return this._favoritedAuthors;
    }

    get avatar() {
        return this._avatar.toString('base64');
    }

    set avatar(value) {
        this._avatar = DataValidator.validateFile(value);
    }
}