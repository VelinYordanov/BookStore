module.exports = function (data, crypto) {
    const passport = require('passport');
    require('./local-stategy')(data, crypto);

    passport.serializeUser((user, done) => {
        console.log('serialize');
        done(null, user._username);
    });

    passport.deserializeUser(async (username, done) => {
        console.log('deserialize');
        try {
            const user = await data.users.findUserByUsername(username);
            if (user) {
                return done(null, user);
            } else {
                return done(null, null);
            }
        } catch {
            return done('Error in getting user from the database', null);
        }
    })

    return passport;
}
