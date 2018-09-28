module.exports = (app, cartService) => {
    app.use('/cart', (req, res, next) => {
        if (!req.user) {
            if (req.method === 'POST') {
                return res.sendStatus('401');
            } else {
                return res.redirect('/login');
            }
        }

        const books = req.session.books || [];
        if (!books.length && req.method === 'POST') {
            return res.sendStatus(400);
        }

        next();
    })

    app.get('/cart', async (req, res) => {
        const cartBooks = req.session.books;
        const books = await cartService.getCartBooks(cartBooks);
        res.render('cart/cart', books);
    })

    app.post('/cart', async (req, res) => {
        const books = req.session.books;
        await cartService.purchaseBooks(books, req.user.id);
        req.session.books = [];
        res.sendStatus(201);
    })

    app.post('/cart/remove', async (req, res) => {
        console.log(req.body);
        console.log(req.session.books);
        const { bookId } = req.body;
        console.log(bookId);
        req.session.books = req.session.books.filter(x => x.id !== bookId);
        console.log(req.session.books);
        res.sendStatus(200);
    })

    app.post('/cart/edit', async (req, res) => {
        const { bookId, quantity } = req.body;
        const bookIndex = res.session.books.findIndex(x => x.id === bookId);
        req.session.books[bookIndex] = { id: bookId, quantity };
        res.sendStatus(200);
    })
}