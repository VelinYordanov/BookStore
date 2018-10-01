var Data = require('./data');
const ObjectId = require('mongodb').ObjectId;

module.exports = class AuthorData extends Data {
    constructor(collection) {
        super(collection);
    }

    findTopAuthors(skip,take) {
        return this.collection.aggregate(
            [
                {
                    $project: {
                        name: 1,
                        picture: 1,
                        bio: 1,
                        rating: { $size: { $ifNull: ["$favorittedBy", []] } }
                    }
                },
                { "$sort": { "rating": -1 } }
            ]
        ).skip(skip).limit(take).toArray();
    }

    searchAuthors(value) {
        return this.collection.find({ "name": { $regex: `.*${value}.*`, $options: "i" } }).toArray();
    }

    deleteAuthorsWithoutBooks() {
        return this.collection.deleteMany({ books: [] });
    }

    addUserToFavorittedBy(authorId, userId) {
        return this.collection.updateOne(
            { _id: ObjectId(authorId) },
            { $addToSet: { favorittedBy: userId } }
        )
    }

    removeUserFromFavorittedBy(authorId, userId) {
        return this.collection.updateOne(
            { _id: ObjectId(authorId) },
            { $pull: { favorittedBy: userId } }
        )
    }
}