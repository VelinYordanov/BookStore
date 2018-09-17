module.exports = function (bookStoreData) {
    let homeService = function () { };
    async function findTopBooksAsync() {
        return await bookStoreData.books.findTopBooks(3);
    }

    async function findTopAuthorsAsync() {
        return await bookStoreData.authors.findTopAuthors(3);
    }

    homeService.findTopBooksAsync = findTopBooksAsync;
    homeService.findTopAuthorsAsync = findTopAuthorsAsync;
    return homeService;
}