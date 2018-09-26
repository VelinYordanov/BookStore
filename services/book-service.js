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

    async function getBook(id) {
        try {
            const book = await bookStoreData.books.find(id);
            book.cover = book.cover.toString('base64');
            return book;
        } catch (err) {
            return
        }
    }

    const bookService = () => { };
    bookService.getBooksAsync = getBooksAsync;
    bookService.getAllBooksCount = getAllBooksCount;
    bookService.getBook = getBook;
    return bookService;
}