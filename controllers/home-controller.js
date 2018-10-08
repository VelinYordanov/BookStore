module.exports = function (app, homeService, authentication) {
    app.get('/', async (req, res) => {
        const topBooksAndUsers = await homeService.getHomeData();
        res.render('home/home', topBooksAndUsers);
    });

    app.post('/search', async (req, res) => {
        const { search } = req.body;
        if (!(search && search.length && (search.length >= 3))) {
            return res.redirect('/');
        }

        var booksAndAuthors = await homeService.searchBooksAndAuthors(search);
        res.render('home/search', booksAndAuthors);
    })

    app.get('/login', (req, res) => {
        res.render('home/login');
    })

    app.post('/login', (req, res, next) => {
        if (!homeService.validateLogin(req.body)) {
            return res.redirect('/login');
        }

        return next();
    }, authentication.authenticate('local', {
        successRedirect: '/',
        failureRedirect: '/login'
    }));

    app.get('/register', (req, res) => {
        res.render('home/register');
    })

    app.post('/register', async (req, res, next) => {
        const result = await homeService.registerUserAsync(req.body);
        if (!result) {
            res.redirect('/register');
        }

        if (result.insertedCount !== 1) {
            return res.redirect('/register');
        }

        const { username, _id } = result.ops[0];
        req.login({ username, _id }, err => {
            if (err) {
                return next(err);
            }

            return res.redirect('/');
        });
    })

    app.get('/logout', (req, res) => {
        req.session.destroy();
        res.redirect('/');
    })
}