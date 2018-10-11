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
            const book = await bookStoreData.books.findBook(id);
            book.cover = book.cover.toString('base64');
            book.comments.forEach(x => {
                x.avatar = x.avatar.toString('base64');
            })
            return book;
        } catch {
            return
        }
    }

    async function favoriteBook(bookId, userId) {
        const book = await bookStoreData.books.find(bookId);
        const bookToAdd = { title: book.title, cover: book.cover, author: book.author, id: book._id }

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

    async function addCommentToBook(userId, bookId, comment) {
        if (comment.length > 500 || comment.length < 5) {
            return false;
        }

        const user = await bookStoreData.users.find(userId);
        const commentToAdd = { username: user.username, avatar: user.avatar, comment, id: user._id };
        await Promise.all(
            [
                bookStoreData.books.addCommentToBook(bookId, commentToAdd),
                bookStoreData.users.addComment(userId, bookId)
            ]);

        commentToAdd.avatar = commentToAdd.avatar.toString('base64');
        return commentToAdd;
    }

    async function loadMoreComments(bookId, skip, take) {
        const result = await bookStoreData.books.loadComments(bookId, skip, take);
        result.comments.forEach(comment => {
            comment.avatar = comment.avatar.toString('base64');
        })

        return result;
    }

    function getBookCommentsCount(id) {
        return bookStoreData.books.getBookCommentsCount(id);
    }

    const bookService = () => { };
    bookService.getBooksAsync = getBooksAsync;
    bookService.getAllBooksCount = getAllBooksCount;
    bookService.getBook = getBook;
    bookService.favoriteBook = favoriteBook;
    bookService.addCommentToBook = addCommentToBook;
    bookService.loadMoreComments = loadMoreComments;
    bookService.getBookCommentsCount = getBookCommentsCount;
    return bookService;
}