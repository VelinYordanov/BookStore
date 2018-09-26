var Data = require('./data');

module.exports = class AuthorData extends Data {
    constructor(collection) {
        super(collection);
    }

    findTopAuthors(number) {
        return this.collection.aggregate(
            [
                {
                    $project: {
                        _name: 1,
                        _picture: 1,
                        _bio: 1,
                        rating: { $size: { $ifNull: ["$favorittedBy", []] } }
                    }
                },
                { "$sort": { "rating": -1 } }
            ]
        ).limit(number).toArray();
    }

    searchAuthors(value) {
        return this.collection.find({ "name": { $regex: `.*${value}.*`, $options: "i" } }).toArray();
    }

    deleteAuthorsWithoutBooks() {
        return this.collection.deleteMany({ books: [] });
    }

    addUserToFavorittedBy(authorId, userId) {
        return this.collection.updateOne(
            { _id: authorId },
            { $addToSet: { favorittedBy: userId } }
        )
    }

    removeUserFromFavorittedBy(authorId, userId) {
        return this.collection.updateOne(
            { _id: authorId },
            { $pull: { favorittedBy: userId } }
        )
    }
}