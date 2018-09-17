var fs = require('fs');

module.exports = (app, services, authentication) => {
    var controllers = fs.readdirSync(__dirname).filter(x => x.endsWith('-controller.js'));
    for(let controller of controllers) {
        let controllerName = controller.substring(0, controller.indexOf('-'));
        let controllerService = services.find(x=>(x.name.substring(0, x.name.indexOf('Service')) === controllerName));
        require('./'+controller)(app, controllerService, authentication);
    }
}
