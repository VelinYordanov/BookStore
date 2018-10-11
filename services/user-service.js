module.exports = bookStoreData => {
    async function getUserData(id) {
        const userData = await bookStoreData.users.find(id);
        userData.favoriteBooks.forEach(book => {
            book.cover = book.cover.toString('base64');
        })

        userData.purchasedBooks.forEach(book => {
            book.cover = book.cover.toString('base64');
        })

        userData.favoriteAuthors.forEach(author => {
            author.picture = author.picture.toString('base64');
        })

        return {
            favoriteBooks: userData.favoriteBooks,
            favoriteAuthors: userData.favoriteAuthors,
            purchasedBooks: userData.purchasedBooks,
            user: { username: userData.username, avatar: userData.avatar.toString('base64') }
        };
    }

    async function addUserImage(image, userId) {
        if (!(image.mimetype.includes('image') && !image.truncated)) {
            return false;
        }

        return bookStoreData.users.addImage(image.data, userId);
    }

    const userService = () => { };
    userService.getUserData = getUserData;
    userService.addUserImage = addUserImage;
    return userService;
}