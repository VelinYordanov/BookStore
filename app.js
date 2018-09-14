var app = require('express')();

require('./configuration')(app);
require('./data').then(bookStoreData => {
    let services = require('./services')(bookStoreData);
    require('./controllers')(app, services);

    app.listen(8080, () => console.log('Started on port 8080'));
});

