var app = require('express')();

require('./configuration')(app);
require('./controllers')(app);

app.listen(8080, () => console.log('Started on port 8080'));