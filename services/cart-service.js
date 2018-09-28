module.exports = bookStoreData => {
    async function getCartBooks(books) {
        books = books || [];
        const cartBooks = await bookStoreData.books.findCartItems(books.map(x => x.id));
        cartBooks.forEach(element => {
            element.cover = element.cover.toString('base64');
            var book = books.find(x => x.id === element._id.toString());
            element.quantity = book.quantity;
        });

        const totalPrice = cartBooks.reduce((x, y) => x + (y.quantity) * y.price, 0);

        return { books: cartBooks, totalPrice };
    }

    async function purchaseBooks(books, userId) {
        const fetchedBooks = await bookStoreData.books.findCartItems(books.map(x => x.id));
        return await Promise.all(
            [
                bookStoreData.users.addPurchasedBooks(fetchedBooks, userId),
                bookStoreData.books.addUserToPurchasedBy(fetchedBooks.map(x => x._id), userId)
            ]
        )
    }

    const cartService = () => { };
    cartService.getCartBooks = getCartBooks;
    cartService.purchaseBooks = purchaseBooks;
    return cartService;
}