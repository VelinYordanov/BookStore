module.exports = (app, bookService) => {
    const BOOKS_PER_PAGE = 25;
    const COMMENTS_PER_LOAD = 5;

    app.use('/books', (req, res, next) => {
        if (!req.user && req.method === 'POST') {
            return res.sendStatus(401);
        }

        next();
    })

    app.use('/books/:id', async (req, res, next) => {
        const id = req.params.id;
        const book = await bookService.getBook(id);
        if (!book) {
            return res.status(404).render('404');
        }

        req.book = book;
        return next();
    })

    app.get('/books', async (req, res) => {
        var page = req.query.page || 1;
        var sort = req.query.sort;

        if (page < 1) {
            page = 1;
        }

        const totalElements = await bookService.getAllBooksCount();
        const maxPage = Math.ceil(totalElements / BOOKS_PER_PAGE);
        if (page > maxPage) {
            page = maxPage;
        }

        const skip = (page - 1) * BOOKS_PER_PAGE;
        const books = await bookService.getBooksAsync(skip, BOOKS_PER_PAGE, sort);
        res.render('books/books', { books, maxPage, sort });
    })

    app.get('/books/:id', async (req, res, next) => {
        const book = req.book;
        if (req.user) {
            book.isFavoritted = book.favorittedBy.includes(req.user.id);
        }

        res.render('books/details', book);
    })

    app.post('/books/:id/purchase', async (req, res) => {
        var { id, quantity } = req.body;
        quantity = +quantity;
        if (!(Number.isInteger(quantity) && quantity > 0)) {
            return res.sendStatus(400);
        }

        if (!req.session.books) {
            req.session.books = [];
        }

        const book = req.book;
        if (req.session.books.some(x => x.id === book._id.toString())) {
            return res.sendStatus(200);
        }

        req.session.books.push({ id: book._id.toString(), quantity });
        res.sendStatus(201);
    })

    app.post('/books/:id/favorite', async (req, res) => {
        const id = req.params.id;
        await bookService.favoriteBook(id, req.user.id);
        res.sendStatus(200);
    })

    app.post('/books/:id/comments', async (req, res) => {
        const { comment } = req.body;
        const result = await bookService.addCommentToBook(req.user.id, req.book._id.toString(), comment);
        if (!result) {
            return res.sendStatus(400);
        }

        return res.render('books/comments', { layout: false, data: {comments: Array.of(result)} });
    })

    app.get('/books/:id/comments', async (req, res) => {
        const bookId = req.book._id.toString();
        var page = req.query.page || 1;
        if (page < 1) {
            page = 1;
        }

        const skip = (page - 1) * COMMENTS_PER_LOAD;
        const comments = await bookService.loadMoreComments(bookId, skip, COMMENTS_PER_LOAD);
        return res.render('books/comments', { layout: false, data: comments });
    })
}