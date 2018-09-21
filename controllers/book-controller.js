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
        res.render('books', { books });
    })

    app.get('/books/:id', async (req, res) => {
        const id = req.params.id;
        const book = await bookService.getBook(id);
    })
}