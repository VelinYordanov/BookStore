function setUpLocalStrategy(data, crypto) {
    const Strategy = require('passport-local').Strategy;
    const passport = require('passport');

    passport.use(new Strategy(async function (username, password, callback) {
        try {
            var user = await data.users.findUserByUsername(username);
            if (user) {
                if (user.password === crypto.generateHashedPassword(user.salt, password)) {
                    return callback(null, user);
                }
            }

            return callback(null, null);
        } catch (err) {
            return callback('Error in retrieving user', null);
        }
    }));
}

module.exports = setUpLocalStrategy;
