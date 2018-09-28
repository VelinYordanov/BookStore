var Data = require('./data');
const ObjectId = require('mongodb').ObjectId;

module.exports = class BookData extends Data {
    constructor(collection) {
        super(collection);
    }

    findTopBooks(number) {
        return this.collection.aggregate(
            [
                {
                    $project: {
                        _title: 1,
                        _price: 1,
                        _author: 1,
                        _description: 1,
                        _cover: 1,
                        rating: { $size: { $ifNull: ["$purchasedBy", []] } }
                    }
                },
                { "$sort": { "rating": -1 } }
            ]
        ).limit(number).toArray();
    }

    searchBooks(value) {
        return this.collection.find({ "title": { $regex: `.*${value}.*`, $options: "i" } }).toArray();
    }

    addUserToPurchasedBy(bookIds, userId) {
        return this.collection.updateMany(
            { _id: { $in: bookIds } },
            { $addToSet: { purchasedBy: userId } }
        )
    }

    addUserToFavorittedBy(bookId, userId) {
        return this.collection.updateOne(
            { _id: ObjectId(bookId) },
            { $addToSet: { favorittedBy: userId } }
        )
    }

    removeUserFromFavorittedBy(bookId, userId) {
        return this.collection.updateOne(
            { _id: ObjectId(bookId) },
            { $pull: { favorittedBy: userId } }
        )
    }

    findCartItems(bookIds) {
        bookIds = bookIds.map(ObjectId);

        return this.collection.find(
            { _id: { $in: bookIds } },
            { projection: { title: 1, cover: 1, price: 1, author: 1 } }
        ).toArray();
    }
}