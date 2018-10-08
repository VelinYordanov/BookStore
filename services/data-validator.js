const maxLength = 50;
const minLength = 5;
const unallowedSymbolsRegex = /\W/;
const numberRegex = /[0-9]/;

const validateRegister = user => {
    if (!user) {
        return false;
    }

    if (!(user.username && user.password && user.repeatPassword)) {
        return false;
    }

    const isUsernameValid = checkStringLength(user.username) && !unallowedSymbolsRegex.test(user.username);
    const isPasswordValid = checkStringLength(user.password) && !unallowedSymbolsRegex.test(user.password) && numberRegex.test(user.password);
    const isRepeatPasswordValid = user.repeatPassword === user.password;
    if (!(isUsernameValid && isPasswordValid && isRepeatPasswordValid)) {
        return false;
    }

    return true;
}

const validateLogin = user => {
    if (!user) {
        return false;
    }

    if (!(user.username && user.password)) {
        return false;
    }

    const isUsernameValid = checkStringLength(user.username) && !unallowedSymbolsRegex.test(user.username);
    const isPasswordValid = checkStringLength(user.password) && !unallowedSymbolsRegex.test(user.password) && numberRegex.test(user.password);
    if (!(isUsernameValid && isPasswordValid)) {
        return false;
    }

    return true;
}

function checkStringLength(value) {
    return value.length >= minLength && value.length <= maxLength;
}

module.exports = { validateLogin, validateRegister };