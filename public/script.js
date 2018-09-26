const addToCartButton = document.getElementById('add-book-to-cart');
const bookId = location.href.split('/').pop();
var isButtonEnabled = true;
addToCartButton.addEventListener('click', async () => {
    if (isButtonEnabled) {
        try {
            const result = await fetch(`/books/purchase/${bookId}`);
            console.log(result);
            if (result.status === 201) {
                // book added to cart
            } else if (result.status === 200) {
                //book already in cart
            } else if (result.status === 401) {
                location.replace('/login');
            }

            isButtonEnabled = false;
        } catch {
            // something went wrong
        } finally {
            isButtonEnabled = true;
        }
    }
})