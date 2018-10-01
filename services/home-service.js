const User = require('../data/models/user');

module.exports = function (bookStoreData, crypto) {
    async function getHomeData() {
        const [books, authors] = await Promise.all([
            bookStoreData.books.findTopFavorittedBooks(0, 3),
            bookStoreData.authors.findTopAuthors(0, 3)]);

        return { books, authors };
    }

    function registerUserAsync(user) {
        const bookStoreUser = new User(user.username, user.password, user.repeatPassword, crypto);
        return bookStoreData.users.add(bookStoreUser);
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
    return homeService;
}