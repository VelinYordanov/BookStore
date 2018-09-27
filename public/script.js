const id = location.href.split('/').pop();
function addBookToCart() {
    const addToCartButton = document.getElementById('add-book-to-cart');
    var isButtonEnabled = true;
    addToCartButton.addEventListener('click', async () => {
        const quantity = +document.getElementById('quantity').value;
        console.log(quantity);
        if (isButtonEnabled) {
            if (Number.isInteger(quantity) && quantity > 0) {
                isButtonEnabled = false;
                try {
                    const result = await doPostRequest(`/books/${id}/purchase`, { id, quantity });
                    console.log(result);
                    if (result.status === 201) {
                        // book added to cart
                    } else if (result.status === 200) {
                        //book already in cart
                    } else if (result.status === 401) {
                        location.replace('/login');
                    }

                } catch {

                } finally {
                    isButtonEnabled = true;
                }
            } else {
                console.log('quantity must be positive');
            }
        }
    })
}

function addBookToFavorites() {
    addToFavorites(`/books/${id}/favorite`,'favorite-book')
}

function addAuthorToFavorites() {
    addToFavorites(`/authors/${id}/favorite`,'favorite-author')
}

function addToFavorites(url, selector) {
    const favoriteBookButton = document.getElementById(selector);
    console.log(favoriteBookButton);
    var isButtonEnabled = true;

    favoriteBookButton.addEventListener('click', async () => {
        if (isButtonEnabled) {
            isButtonEnabled = false;
            try {
                const result = await doPostRequest(url, { id });
                console.log(result);
                if (result.status === 200) {
                    //success
                } else {
                    //error
                }
            } catch {
                //error in sending request
            } finally {
                isButtonEnabled = true;
            }
        }
    })
}

function doPostRequest(url, body) {
    return fetch(url,
        {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body)
        });
}
try {
    addBookToFavorites();
} catch {

}
try {
    addAuthorToFavorites();
} catch {

}

try {
    addBookToCart();
} catch {
    
}
