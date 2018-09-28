const id = location.href.split('/').pop();
function addBookToCart() {
    const addToCartButton = document.getElementById('add-book-to-cart');
    var isButtonEnabled = true;
    addToCartButton.addEventListener('click', async () => {
        const quantity = +document.getElementById('quantity').value;
        if (isButtonEnabled) {
            if (Number.isInteger(quantity) && quantity > 0) {
                isButtonEnabled = false;
                try {
                    const result = await doPostRequest(`/books/${id}/purchase`, { id, quantity });
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
    addToFavorites(`/books/${id}/favorite`, 'favorite-book')
}

function addAuthorToFavorites() {
    addToFavorites(`/authors/${id}/favorite`, 'favorite-author')
}

function addToFavorites(url, selector) {
    const favoriteBookButton = document.getElementById(selector);
    var isButtonEnabled = true;

    favoriteBookButton.addEventListener('click', async () => {
        if (isButtonEnabled) {
            isButtonEnabled = false;
            try {
                const result = await doPostRequest(url, { id });
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

function removeBookFromCart() {
    const removeButtons = Array.from(document.getElementsByClassName('remove'));
    removeButtons.forEach(element => {
        element.addEventListener('click', async (event) => {
            const parent = event.target.parentElement;
            const id = parent.getElementsByClassName('id')[0].value;
            const result = await doPostRequest('/cart/remove', { bookId: id });
            if (result.status === 200) {
                location.reload();
            } else {
                //problem
            }
        })
    });
}

function purchaseBooks() {
    const purchaseButton = document.getElementById('purchase');
    purchaseButton.addEventListener('click', async () => {
        const result = await doPostRequest('/cart', {});
        console.log(result);
        if (result.status === 200) {
            //success
        } else if (result.status === 400) {
            //no items in cart
        } else {
            //problem
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

try {
    purchaseBooks()
} catch {

}
try {
    removeBookFromCart();
} catch {

}
