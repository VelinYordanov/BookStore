const express = require('express');
const handlebars = require('express-handlebars');
const session = require('express-session');
const bodyParser = require('body-parser');
const passport = require('passport');
const db = require('../data/db-provider');
const MongoStore = require('connect-mongo')(session);

module.exports = (app) => {
    const exhbs = handlebars.create({
        helpers: {
            pages: function (n, block) {
                var accum = '';
                for (var i = 1; i <= n; ++i)
                    accum += block.fn(i);
                return accum;
            }
        },
        defaultLayout: 'main'
    })
    app.engine('handlebars', exhbs.engine);
    app.set('view engine', 'handlebars');
    app.use(express.static('public'));
    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(bodyParser.json());
    app.use(session({
        secret: 'big-secret',
        resave: false,
        store: new MongoStore({ dbPromise: db }),
        saveUninitialized: false,
        cookie: { httpOnly: true }
    }))

    app.use(passport.initialize());
    app.use(passport.session())
}