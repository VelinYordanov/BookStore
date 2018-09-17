module.exports = function (app, homeService) {
    app.get('/', async (req, res) => {
        res.json({ topBooks: await homeService.findTopBooksAsync() })
        //res.render('home');
    });
}