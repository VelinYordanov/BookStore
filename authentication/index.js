module.exports = function (data, crypto) {
    const passport = require('passport');
    require('./local-stategy')(data, crypto);

    passport.serializeUser((user, done) => {
        console.log('serialize');
        done(null, { id: user._id.toString(), username: user.username });
    });

    passport.deserializeUser(async (user, done) => {
        //We don't need all the user information for every request
        console.log('deserialize');
        return done(null, user);

        // try {
        //     const user = await data.users.findUserByUsername(username);
        //     if (user) {
        //         return done(null, user);
        //     } else {
        //         return done(null, null);
        //     }
        // } catch {
        //     return done('Error in getting user from the database', null);
        // }
    })

    return passport;
}
