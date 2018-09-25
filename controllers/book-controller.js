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

    // app.use('/books', (req, res, next) => {
    //     console.log(req.user);
    //     if (!req.user) {
    //         return next();
    //     }

    //     res.redirect('/login');
    // })

    app.get('/books/purchase/:id', async (req, res, next) => {
        try {
            const id = req.params.id;
            console.log(req.session.books);
            if (!req.session.books) {
                req.session.books = [];
            }

            const book = await bookService.getBook(id);
            if (!book) {
                return next();
            }

            req.session.books.push(book);
            res.status(200).end();
        } catch {
            return next();
        }
    })
}