var app = require('express')();
const port  = process.env.PORT || 8081;

require('./data').then(bookStoreData => {
    require('./configuration')(app);
    const crypto = require('./encryption');
    const authentication = require('./authentication')(bookStoreData, crypto);
    const services = require('./services')(bookStoreData, crypto);
    require('./controllers')(app, services, authentication);

    app.listen(port, () => console.log(`Started on port ${port}`));
});





