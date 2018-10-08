(function validateForms() {
    const maxLength = 50;
    const minLength = 5;
    const allowedSymbolsRegex = /^\w/;
    const numberRegex = /[0-9]/;

    function checkStringLength(value) {
        return value.length <= minLength && value.length >= maxLength;
    }

    const form = document.getElementById('login-form');
    form.addEventListener('submit', (event) => {
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;

        const isUsernameValid = checkStringLength(username) && allowedSymbolsRegex.test(username);
        const isPasswordValid = checkStringLength(password) && allowedSymbolsRegex.test(password) && numberRegex.test(password);

        if (isUsernameValid && isPasswordValid) {
            return true;
        }



        return false;
    })
}())

const maxLength = 50;
const minLength = 5;
const allowedSymbolsRegex = /^\w/;
    const numberRegex = /[0-9]/;

function validateLogin() {
    document.getElementById('errors').innerText = "";
    const errors = [];
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    const isUsernameValid = checkStringLength(username) && allowedSymbolsRegex.test(username);
    const isPasswordValid = checkStringLength(password) && allowedSymbolsRegex.test(password) && numberRegex.test(password);

    if (isUsernameValid && isPasswordValid) {
        return true;
    }

    if(!isUsernameValid) {
        errors.push('Username must be between 5 and 50 symbols and contain only letters digits and _');
    }

    if(!isPasswordValid) {
        errors.push('Password must be between 5 and 50 symbols long and should contain at least 1 number');
    }

    document.getElementById('errors').innerText = errors.join('\n');

    return false;
}

function checkStringLength(value) {
    return value.length >= minLength && value.length <= maxLength;
}