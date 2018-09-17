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


}