var fs = require('fs');

module.exports = (data) => {
    var services = fs.readdirSync(__dirname).filter(x => x.endsWith('-service.js')).map(x=>'./'+x);
    return services.map(x => require(x)(data));
}