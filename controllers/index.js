var fs = require('fs');

module.exports = (app, services, authentication) => {
    app.use((req, res, next) => {
        res.locals.user = req.user;
        res.locals.items = req.session.books ? req.session.books.length : 0;
        next();
    })

    app.use((req, res, next) => {
        if (req.session.error) {
            res.locals.error = req.session.error;
            req.session.error = null;
        }

        next();
    })

    var controllers = fs.readdirSync(__dirname).filter(x => x.endsWith('-controller.js'));
    for (let controller of controllers) {
        let controllerName = controller.substring(0, controller.indexOf('-'));
        let controllerService = services.find(x => (x.name.substring(0, x.name.indexOf('Service')) === controllerName));
        require('./' + controller)(app, controllerService, authentication);
    }

    app.use((err, req, res, next) => {
        return res.status(500).render('500');
    })

    app.use((req, res) => {
        res.status(404).render('404');
    })
}
