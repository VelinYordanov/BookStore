module.exports = (app, bookService) => {
    const BOOKS_PER_PAGE = 25;

    app.use('/books', (req, res, next) => {
        if (!req.user && req.method === 'POST') {
            return res.sendStatus(401);
        }

        next();
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
        res.render('books/books', { books, maxPage });
    })

    app.get('/books/:id', async (req, res, next) => {
        const id = req.params.id;
        const book = await bookService.getBook(id);
        if (!book) {
            return next();
        }

        if(req.user) {
           book.favorittedBy = book.favorittedBy.includes(req.user.id);
        }

        res.render('books/details', book);
    })

    app.post('/books/:id/purchase', async (req, res) => {
        console.log(req.body);
        var { id, quantity } = req.body;
        quantity = +quantity;
        if (!(Number.isInteger(quantity) && quantity > 0)) {
            return res.sendStatus(400);
        }

        if (!req.session.books) {
            req.session.books = [];
        }

        const book = await bookService.getBook(id);
        if (!book) {
            return res.sendStatus(404);
        }

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
}