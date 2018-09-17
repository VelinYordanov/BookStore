module.exports = function (app, homeService, authentication) {
    app.get('/', async (req, res) => {
        res.json({ topBooks: await homeService.findTopBooksAsync() })
        //res.render('home');
    });

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