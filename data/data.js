var ObjectId = require('mongodb').ObjectId;

module.exports = class Data {
    constructor(collection) {
        this.collection = collection;
    }

    add(value) {
        return this.collection.insertOne(value);
    }

    find(id) {
        return this.collection.findOne({ _id: ObjectId(id) });
    }

    findMany(skip, take) {
        return this.collection.find().skip(skip).limit(take).toArray();
    }

    delete(id) {
        return this.collection.deleteOne({ _id: ObjectId(id) });
    }

    update(id, element) {
        return this.collection.updateOne(
            { _id: ObjectId(id) },
            { $set: element }
        )
    }
}