class Validator {
    validateString(value, minLength, maxLength) {
        if (typeof value === 'string') {
            value = value.trim();
            if (value.length >= minLength && value.length <= maxLength) {
                return value;
            }
        }

        throw new Error(`Value must be a string between ${minLength} and ${maxLength}`);
    }

    validateFile(value) {
        if (value instanceof Buffer) {
            return value;
        }

        throw new Error("Value must be byte array");
    }

    validateNumber(value) {
        if (!isNaN(parseFloat(value)) && isFinite(value)) {
            return value;
        }

        throw new Error("Price must be a number");
    }

    validateBookAuthor(value) {
        if (value.name && value.id) {
            return value;
        }

        throw new Error("Author must be an object with id and name");
    }

    validateBookIsbn(value) {
        if(value.match(/(\d{10}|\d{13})$/)) {
            return value;
        }

        throw new Error("Isbn must be 10 or 13 characters long and be all digits");
    }
}

module.exports = new Validator();