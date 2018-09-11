class DataValidator {
    static validateString(value, minLength, maxLength) {
        if(typeof(value) === 'string') {
            value = value.trim();
            if(value.length > minLength && value.length < maxLength) {
                return value;
            }
        }

        throw new Error(`Value must be a string with length between ${minLength} and ${maxLength}`);
    }

    static validateFile(value) {
        if(value instanceof Buffer) {
           return value;
        }

        throw new Error('Value must be a byte array');
    }
}