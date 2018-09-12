module.exports = class Data {
    constructor(collection) {
        this.collection = collection;
    }

    add(value) {
        this.collection.insertOne(value);
    }

    find(id) {
        this.collection.findOne({ _id: id });
    }

    getMany(skip, take) {
        this.collection.find().skip(skip).limit(take).toArray();
    }

    delete(id) {
        this.collection.deleteOne({ _id: id });
    }

    update(id, element) {
        this.collection.updateOne(
            { _id: id },
            { $set: element }
        )
    }
}