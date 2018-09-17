class Validator {
    validateString(value, minLength, maxLength) {
        if(typeof value === 'string') {
            value = value.trim();
            if(value.length  >= minLength && value.length <= maxLength) {
                return value;
            }
        }

        throw new Error(`Value must be a string between ${minLength} and ${maxLength}`);
    }

    validateFile(value) {
        if(value instanceof Buffer) {
            return value;
        }

        throw new Error("Value must be byte array");
    }
}

module.exports = new Validator();