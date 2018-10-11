(function validateForms() {
    const maxLength = 50;
    const minLength = 5;
    const unallowedSymbolsRegex = /\W/;
    const numberRegex = /[0-9]/;

    function checkStringLength(value) {
        return value.length >= minLength && value.length <= maxLength;
    }

    function validateLogin() {
        const submitButton = document.getElementById('login-button');
        if (!submitButton) {
            return;
        }

        submitButton.addEventListener('click', event => {
            event.preventDefault();
            const usernameErrorDisplay = document.getElementById('username-errors');
            const passwordErrorDisplay = document.getElementById('password-errors');
            usernameErrorDisplay.innerText = "";
            passwordErrorDisplay.innerText = "";

            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;

            const isUsernameValid = checkStringLength(username) && !unallowedSymbolsRegex.test(username);
            const isPasswordValid = checkStringLength(password) && !unallowedSymbolsRegex.test(password) && numberRegex.test(password);

            if (isUsernameValid && isPasswordValid) {
                document.getElementById('login-form').submit();
            }

            if (!isUsernameValid) {
                usernameErrorDisplay.innerText = `Username must be between ${minLength} and ${maxLength} symbols and contain only letters digits and _`
            }

            if (!isPasswordValid) {
                passwordErrorDisplay.innerText = `Password must be between ${minLength} and ${maxLength} symbols long, containing letters, digits or _,  and should contain at least 1 number`
            }
        })
    }

    function validateRegister() {
        const submitButton = document.getElementById('register-button');
        if (!submitButton) {
            return;
        }

        submitButton.addEventListener('click', event => {
            event.preventDefault();
            const usernameErrorDisplay = document.getElementById('username-errors');
            const passwordErrorDisplay = document.getElementById('password-errors');
            const repeatPasswordErrorDisplay = document.getElementById('repeat-password-errors');
            usernameErrorDisplay.innerText = "";
            passwordErrorDisplay.innerText = "";
            repeatPasswordErrorDisplay.innerText = "";

            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;
            const repeatPassword = document.getElementById('repeat-password').value;

            const isUsernameValid = checkStringLength(username) && !unallowedSymbolsRegex.test(username);
            const isPasswordValid = checkStringLength(password) && !unallowedSymbolsRegex.test(password) && numberRegex.test(password);
            const isRepeatPasswordValid = repeatPassword === password;

            if (isUsernameValid && isPasswordValid && isRepeatPasswordValid) {
                document.getElementById('register-form').submit();
            }

            if (!isUsernameValid) {
                usernameErrorDisplay.innerText = `Username must be between ${minLength} and ${maxLength} symbols and contain only letters digits and _`
            }

            if (!isPasswordValid) {
                passwordErrorDisplay.innerText = `Password must be between ${minLength} and ${maxLength} symbols long and should contain at least 1 number`
            }

            if (!isRepeatPasswordValid) {
                repeatPasswordErrorDisplay.innerText = 'Repeated password is not the same as the provided password';
            }
        })
    }

    function validateSearch() {
        const searchForm = document.getElementById('search-form');
        if (!searchForm) {
            return;
        }
        searchForm.addEventListener('submit', event => {
            const searchErrors = document.getElementById('search-errors');
            searchErrors.innerText = "";
            event.preventDefault();
            const searched = document.getElementById('search').value;
            if (searched.length < 3) {
                searchErrors.innerText = "Must be at least 3 symbols long";
            } else {
                searchForm.submit();
            }
        })
    }

    function profileFileUpload() {
        const $inputGroup = $('#inputGroupFile');
        if(!$inputGroup) {
            return;
        }

        $('#inputGroupFile').on('change',function(){
            //get the file name
            var filePath = $(this).val();
            const fileName = filePath.split('\\').pop();
            //replace the "Choose a file" label
            $(this).next('.custom-file-label').html(fileName);
        })
    }

    validateLogin();
    validateRegister();
    validateSearch();
    profileFileUpload();
}())