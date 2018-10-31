module.exports = (app, authorService) => {
    const AUTHORS_PER_PAGE = 15;

    app.get('/authors', async (req, res, next) => {
        try {
            var page = req.query.page || 1;
            const sort = req.query.sort;
            if (page < 1) {
                page = 1;
            }

            const totalElements = await authorService.getAllAuthorsCount();
            const maxPage = Math.ceil(totalElements / AUTHORS_PER_PAGE);
            if (page > maxPage) {
                page = maxPage;
            }

            const skip = (page - 1) * AUTHORS_PER_PAGE;
            const authors = await authorService.getAuthorsAsync(skip, AUTHORS_PER_PAGE, sort);
            res.render('authors/authors', { authors, maxPage });
        } catch (err) {
            return next(err);
        }
    })

    app.get('/authors/:id', async (req, res, next) => {
        try {
            const id = req.params.id;
            const author = await authorService.getAuthor(id);
            if (!author) {
                return next();
            }
            if (req.user) {
                author.isFavoritted = author.favorittedBy.includes(req.user.id);
            }

            res.render('authors/details', author);
        } catch (err) {
            return next(err);
        }
    })

    app.post('/authors/:id/favorite', async (req, res, next) => {
        try {
            if (!req.user) {
                return res.sendStatus(401);
            }

            const id = req.params.id;
            await authorService.favoriteAuthor(id, req.user.id);
            return res.sendStatus(200);
        } catch (err) {
            return next(err);
        }
    })
}