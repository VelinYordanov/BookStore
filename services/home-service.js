const User = require('../data/models/user');

module.exports = function (bookStoreData, crypto) {
    let homeService = function () { };
    function findTopBooksAsync() {
        return bookStoreData.books.findTopBooks(3);
    }

    function findTopAuthorsAsync() {
        return bookStoreData.authors.findTopAuthors(3);
    }

    function registerUserAsync(user) {
        const bookStoreUser = new User(user.username, user.password,user.repeatPassword, crypto);
        return bookStoreData.users.add(bookStoreUser);
    }

    homeService.findTopBooksAsync = findTopBooksAsync;
    homeService.findTopAuthorsAsync = findTopAuthorsAsync;
    homeService.registerUserAsync = registerUserAsync;
    return homeService;
}