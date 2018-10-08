module.exports = function (data, crypto) {
    const passport = require('passport');
    require('./local-stategy')(data, crypto);

    passport.serializeUser((user, done) => {
        done(null, { id: user._id.toString(), username: user.username });
    });

    passport.deserializeUser(async (user, done) => {
        //We don't need all the user information for every request
        return done(null, user);
    })

    return passport;
}
