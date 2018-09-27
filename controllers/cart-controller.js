module.exports = (app, cartService) => {
    app.use('/cart', (req, res, next) => {
        if (!req.user) {
            return res.redirect('/login');
        }

        next();
    })

    app.get('/cart', async (req, res) => {
        const cartBooks = req.session.books;
        const books = await cartService.getCartBooks(cartBooks);
        res.render('cart/cart', books);
    })
}