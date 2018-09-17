const express = require('express');
const handlebars = require('express-handlebars');
const session = require('express-session');
const bodyParser = require('body-parser');

module.exports = (app) => {
    app.engine('handlebars', handlebars({ defaultLayout: 'main' }));
    app.set('view engine', 'handlebars');
    app.use(express.static('public'));
    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(session({
        secret: 'big-secret',
        resave: false,
        saveUninitialized: false,
        cookie: { httpOnly: true }
    }))
}