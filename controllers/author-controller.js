module.exports = (app, authorService) => {
    const authorsPerPage = 15;

    app.get('/authors', async (req, res) => {
        var page = req.query.page || 1;
        if (page < 1) {
            page = 1;
        }

        const totalElements = await authorService.getAllAuthorsCount();
        const maxPage = Math.ceil(totalElements / authorsPerPage);
        if (page > maxPage) {
            page = maxPage;
        }

        const skip = (page - 1) * authorsPerPage;
        const authors = await authorService.getAuthorsAsync(skip, authorsPerPage);
        res.render('authors/authors', { authors });
    })

    app.get('/authors/:id', async (req, res, next) => {
        const id = req.params.id;
        const author = await authorService.getAuthor(id);
        if (!author) {
            return next();
        }

        res.render('authors/details', author);
    })
}