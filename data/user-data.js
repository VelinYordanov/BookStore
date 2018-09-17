const Data = require('./data');

module.exports = class UserData extends Data {
    constructor(collection) {
        super(collection);
    }

    findUserByUsername(username) {
        return this.collection.findOne({_username : username});
    }
}