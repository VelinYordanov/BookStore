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
            purchasedBooks: userData.purchasedBooks
        };
    }

    const userService = () => { };
    userService.getUserData = getUserData;
    return userService;
}