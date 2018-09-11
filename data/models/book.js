class Book {
    constructor(title,description,author,isbn,cover) {
        this.title = title;
        this.description = description;
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

    get rating() {
        return this.favorittedBy.length;
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

    get cover() {
        return this._cover.toString('base64');
    }

    set cover(value) {
        this._cover = DataValidator.validateFile(value);
    }
}