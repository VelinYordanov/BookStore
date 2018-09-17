var Data = require('./data');

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
}