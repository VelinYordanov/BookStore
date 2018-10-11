module.exports = function (app, homeService, authentication) {
    app.get('/', async (req, res, next) => {
        try {
            const topBooksAndUsers = await homeService.getHomeData();
            res.render('home/home', topBooksAndUsers);
        } catch (err) {
            return next(err);
        }
    });

    app.post('/search', async (req, res, next) => {
        try {
            const { search } = req.body;
            if (!(search && search.length && (search.length >= 3))) {
                req.session.error = "Searched text must be at least 3 symbols long";
                return res.redirect('/');
            }

            var booksAndAuthors = await homeService.searchBooksAndAuthors(search);
            res.render('home/search', booksAndAuthors);
        } catch (err) {
            return next(err);
        }
    })

    app.get('/login', (req, res, next) => {
        try {
            res.render('home/login');
        } catch (err) {
            return next(err);
        }
    })

    app.post('/login', (req, res, next) => {
        if (!homeService.validateLogin(req.body)) {
            req.session.error = "Data not valid";
            return res.redirect('/login');
        }

        return next();
    }, authentication.authenticate('local', {
        successRedirect: '/',
        failureRedirect: '/login'
    }));

    app.get('/register', (req, res, next) => {
        try {
            res.render('home/register');
        } catch (err) {
            return next(err);
        }
    })

    app.post('/register', async (req, res, next) => {
        try {
            const result = await homeService.registerUserAsync(req.body);
            if (!result) {
                req.session.error = "Username already exists";
                return res.redirect('/register');
            }

            if (result.insertedCount !== 1) {
                req.session.error = "Ooops something wrong, try again later!";
                return res.redirect('/register');
            }

            const { username, _id } = result.ops[0];
            req.login({ username, _id }, err => {
                if (err) {
                    return next(err);
                }

                return res.redirect('/');
            });
        } catch (err) {
            return next(err);
        }
    })

    app.get('/logout', (req, res, next) => {
        try {
            req.session.destroy();
            res.redirect('/');
        } catch(err) {
            return next(err);
        }       
    })
}