module.exports = (bookStoreData) => {
    async function getBooksAsync(skip, take) {
        const books = await bookStoreData.books.findMany(skip, take);
        books.forEach(element => {
            element.cover = element.cover.toString('base64');
        });

        return books;
    }

    function getAllBooksCount() {
        return bookStoreData.books.count();
    }

    function getBook(id) {
        return bookStoreData.books.find(id);
    }

    const bookService = () => { };
    bookService.getBooksAsync = getBooksAsync;
    bookService.getAllBooksCount = getAllBooksCount;
    bookService.getBook = getBook;
    return bookService;
}