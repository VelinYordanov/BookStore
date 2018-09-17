async function setUpLocalStrategy(data, crypto) {
    const Strategy = require('passport-local').Strategy;
    const passport = require('passport');

    passport.use(new Strategy(async function (username, password, callback) {
        try {
            var user = await data.findUserByUsername(username);
            if (user._password === crypto.generateHashedPassword(user.salt, password)) {
                return callback(null, user);
            } else {
                return callback(null, null);
            }
        } catch {
            return callback('Error in retrieving user', null);
        }
    }));
}

module.exports = setUpLocalStrategy;
