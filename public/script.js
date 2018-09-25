const addToCartButton = document.getElementById('add-book-to-cart');
const bookId = location.href.split('/').pop();
var isButtonEnabled = true;
addToCartButton.addEventListener('click', async () => {
    if (isButtonEnabled) {
        try {
            const result = await fetch(`/books/purchase/${bookId}`);
            if (result.status / 100 === 2) {
                //success
            } else {
                //error
            }
            
            isButtonEnabled = false;
        } catch {
            console.log("error");
        }
    }
})