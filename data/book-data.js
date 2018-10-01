var Data = require('./data');
const ObjectId = require('mongodb').ObjectId;

module.exports = class BookData extends Data {
    constructor(collection) {
        super(collection);
    }

    findTopSelledBooks(skip, take) {
        return this.collection.aggregate(
            [
                {
                    $project: {
                        title: 1,
                        price: 1,
                        author: 1,
                        description: 1,
                        cover: 1,
                        purchasedBy: 1,
                        favorittedBy: 1,
                        sells: { $size: { $ifNull: ["$purchasedBy", []] } }
                    }
                },
                { "$sort": { "sells": -1 } }
            ]
        ).skip(skip).limit(take).toArray();
    }

    findTopFavorittedBooks(skip, take) {
        return this.collection.aggregate(
            [
                {
                    $project: {
                        title: 1,
                        price: 1,
                        author: 1,
                        description: 1,
                        cover: 1,
                        favorittedBy: 1,
                        purchasedBy: 1,
                        favorites: { $size: { $ifNull: ["$favorittedBy", []] } }
                    }
                },
                { "$sort": { "favorites": -1 } }
            ]
        ).skip(skip).limit(take).toArray();
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