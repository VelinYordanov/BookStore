module.exports = (app, bookService) => {
    const booksPerPage = 15;

    app.get('/books', async (req, res) => {
        var page = req.query.page || 1;
        if (page < 1) {
            page = 1;
        }

        const totalElements = await bookService.getAllBooksCount();
        const maxPage = Math.ceil(totalElements / booksPerPage);
        if (page > maxPage) {
            page = maxPage;
        }

        const skip = (page - 1) * booksPerPage;
        const books = await bookService.getBooksAsync(skip, booksPerPage);
        res.render('books/books', { books });
    })

    app.get('/books/:id', async (req, res, next) => {
        const id = req.params.id;
        const book = await bookService.getBook(id);
        if (!book) {
            return next();
        }

        res.render('books/details', book);
    })

    app.get('/books/purchase/:id', async (req, res) => {
        const id = req.params.id;
        if (!req.session.bookIds) {
            req.session.bookIds = [];
        }

        const book = await bookService.getBook(id);
        if (!book) {
            return res.status(404).end();
        }

        if (!req.user) {
            return res.status(401).end();
        }

        if (req.session.bookIds.includes(book._id.toString())) {
            return res.status(200).end();
        }

        req.session.bookIds.push(book._id.toString());
        res.status(201).end();

    })

    app.get('/books/:id/favorite', async (req, res) => {
        if (!req.user) {
            res.status(401).end();
        }

        const id = req.params.id;
        await bookService.favoriteBook(id, req.user.id);
        res.status(200).end();
    })
}