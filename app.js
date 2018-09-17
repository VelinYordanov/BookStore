var app = require('express')();

require('./data').then(bookStoreData => {
    require('./configuration')(app);
    const crypto = require('./encryption');
    const authentication = require('./authentication')(bookStoreData, crypto);
    const services = require('./services')(bookStoreData, crypto);
    require('./controllers')(app, services, authentication);

    app.listen(8080, () => console.log('Started on port 8080'));
});





