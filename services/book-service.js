module.exports = (bookStoreData) => {
    const SORTING_OPTIONS =
        [
            { name: 'favorites', data: bookStoreData.books.findTopFavorittedBooks.bind(bookStoreData.books) },
            { name: 'sells', data: bookStoreData.books.findTopSelledBooks.bind(bookStoreData.books) }
        ];

    async function getBooksAsync(skip, take, sort) {
        var books;
        const option = SORTING_OPTIONS.find(x => x.name === sort);
        if (option) {
            books = await option.data(skip, take);
        } else {
            books = await bookStoreData.books.findMany(skip, take);
        }

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

    async function favoriteBook(bookId, userId) {
        const book = await bookStoreData.books.find(bookId);
        const bookToAdd = { title: book.title, cover: book.cover, author: book.author, id: book._id, favorittedBy: book.favorittedBy }

        if (book.favorittedBy.includes(userId)) {
            return await Promise.all(
                [
                    bookStoreData.books.removeUserFromFavorittedBy(bookId, userId),
                    bookStoreData.users.removeBookFromFavorites(bookToAdd, userId)
                ]
            );
        }

        return await Promise.all(
            [
                bookStoreData.books.addUserToFavorittedBy(bookId, userId),
                bookStoreData.users.addBookToFavorites(bookToAdd, userId)
            ]
        );
    }

    const bookService = () => { };
    bookService.getBooksAsync = getBooksAsync;
    bookService.getAllBooksCount = getAllBooksCount;
    bookService.getBook = getBook;
    bookService.favoriteBook = favoriteBook;
    return bookService;
}