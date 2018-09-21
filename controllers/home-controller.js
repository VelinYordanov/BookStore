module.exports = function (app, homeService, authentication) {
    app.get('/', async (req, res) => {
        res.render('home');
    });

    app.post('/search', async (req, res) => {
        const { search } = req.body;
        if (!(search && search.length && (search.length > 3))) {
            return res.redirect('/');
        }

        var booksAndAuthors = await homeService.searchBooksAndAuthors(search);
        res.render('search', booksAndAuthors);
    })

    app.get('/login', (req, res) => {
        res.render('login');
    })

    app.post('/login', authentication.authenticate('local', {
        successRedirect: '/',
        failureRedirect: '/login'
    }));

    app.get('/register', (req, res) => {
        res.render('register');
    })

    app.post('/register', async (req, res) => {
        await homeService.registerUserAsync(req.body);
        res.redirect('/');
    })

    app.get('/logout', (req, res) => {
        req.logout();
        res.redirect('/');
    })
}