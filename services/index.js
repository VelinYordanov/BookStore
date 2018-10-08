const fs = require('fs');
const validator = require('./data-validator');

module.exports = (data, crypto) => {
    var services = fs.readdirSync(__dirname).filter(x => x.endsWith('-service.js')).map(x=>'./'+x);
    return services.map(x => require(x)(data, crypto, validator));
}