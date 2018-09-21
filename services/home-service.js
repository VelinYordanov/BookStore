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
        const bookStoreUser = new User(user.username, user.password, user.repeatPassword, crypto);
        return bookStoreData.users.add(bookStoreUser);
    }

    async function searchBooksAndAuthors(value) {
        const result = await Promise.all([
            bookStoreData.authors.searchAuthors(value),
            bookStoreData.books.searchBooks(value)
        ]);

        result[0].forEach(element => {
            element.picture = element.picture.toString('base64');
        });

        result[1].forEach(element => {
            element.cover = element.cover.toString('base64');
        })

        return { authors: result[0], books: result[1] }
    }

    homeService.findTopBooksAsync = findTopBooksAsync;
    homeService.findTopAuthorsAsync = findTopAuthorsAsync;
    homeService.registerUserAsync = registerUserAsync;
    homeService.searchBooksAndAuthors = searchBooksAndAuthors;
    return homeService;
}