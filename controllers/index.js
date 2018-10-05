var fs = require('fs');

module.exports = (app, services, authentication) => {
    app.use((req, res, next) => {
        app.locals.user = req.user;
        app.locals.items = req.session.books ? req.session.books.length : 0;
        next();
    })

    var controllers = fs.readdirSync(__dirname).filter(x => x.endsWith('-controller.js'));
    for (let controller of controllers) {
        let controllerName = controller.substring(0, controller.indexOf('-'));
        let controllerService = services.find(x => (x.name.substring(0, x.name.indexOf('Service')) === controllerName));
        require('./' + controller)(app, controllerService, authentication);
    }

    app.all('*', (req, res) => {
        res.status(404).render('404');
    })
}
