const User = require('../data/models/user');

module.exports = function (bookStoreData, crypto, validator) {
    async function getHomeData() {
        const [books, authors] = await Promise.all([
            bookStoreData.books.findTopFavorittedBooks(0, 3),
            bookStoreData.authors.findTopAuthors(0, 3)]);

        books.forEach(x => x.cover = x.cover.toString('base64'));
        authors.forEach(x => x.picture = x.picture.toString('base64'));
        return { books, authors };
    }

    async function registerUserAsync(user) {
        const isDataValid = validator.validateRegister(user);
        if (!isDataValid) {
            return false;
        }

        const maybeUserWithTheSameName = await bookStoreData.users.findUserByUsername(user.username);
        if (maybeUserWithTheSameName) {
            return false;
        }

        const bookStoreUser = new User(user.username, user.password, user.repeatPassword, crypto);
        return bookStoreData.users.add(bookStoreUser);
    }

    function validateLogin(user) {
        return validator.validateLogin(user);
    }

    async function searchBooksAndAuthors(value) {
        const [authors, books] = await Promise.all([
            bookStoreData.authors.searchAuthors(value),
            bookStoreData.books.searchBooks(value)
        ]);

        authors.forEach(element => {
            element.picture = element.picture.toString('base64');
        });

        books.forEach(element => {
            element.cover = element.cover.toString('base64');
        })

        return { authors, books }
    }

    const homeService = () => { };
    homeService.getHomeData = getHomeData;
    homeService.registerUserAsync = registerUserAsync;
    homeService.searchBooksAndAuthors = searchBooksAndAuthors;
    homeService.validateLogin = validateLogin;
    return homeService;
}