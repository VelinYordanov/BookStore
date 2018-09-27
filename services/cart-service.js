module.exports = (bookStoreData) => {
    async function getCartBooks(books) {
        const cartBooks = await bookStoreData.books.findCartItems(books.map(x => x.id));
        console.log(cartBooks);
        cartBooks.forEach(element => {
            element.cover = element.cover.toString('base64');
            var book = books.find(x => x.id === element._id.toString());
            element.quantity = book.quantity;
        });

        const totalPrice = cartBooks.reduce((x, y) => x + (y.quantity) * y.price, 0);

        return { books: cartBooks, totalPrice };
    }

    const cartService = () => { };
    cartService.getCartBooks = getCartBooks;
    return cartService;
}