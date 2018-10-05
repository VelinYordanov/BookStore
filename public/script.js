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
                    console.log(result);
                    if (result.status === 201) {
                        toastr.success('Added to cart!')
                        redirect('/books')
                    } else if (result.status === 200) {
                        toastr.info('Book already in cart');
                        redirect('/books')
                    } else if (result.status === 401) {
                        toastr.error("You need to login to purchase books");
                        redirect('/login')
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
                console.log(result);
                if (result.status === 200) {
                    toastr.success("Success");
                    //console.log(favoriteBookButton.classList.toggle('fas'));
                    favoriteBookButton.classList.toggle('fas');
                    favoriteBookButton.classList.toggle('far');
                    if(favoriteBookButton.classList.contains('fas')) {
                        document.getElementById('favorites-count').textContent = +document.getElementById('favorites-count').textContent + 1;
                    } else {
                        document.getElementById('favorites-count').textContent = +document.getElementById('favorites-count').textContent - 1;
                    }
                    //favoriteButton.classList.toggle('far');                    
                    
                } else {
                    toastr.error("You need to register in order to favorite items");
                    redirect('/login');
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
            console.log(result);
            if (result.status === 200) {
                toastr.success('Removed item from cart');
                var $element = $(event.target.parentElement.parentElement);
                $element.hide('slow', function(){ $element.remove(); });
               // location.reload();
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
        if (result.status === 201) {
            toastr.success("Purchased books!");
        } else if (result.status === 400) {
            toastr.error("No items in cart")
        } else {
            toastr.error("Ooops something went wrong, try again later");
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

function redirect(url) {
    const REDIRECT_TIMEOUT = 0.75 * 1000;
    setTimeout(() => {
        console.log('timeout')
        location.replace(url);
    }, REDIRECT_TIMEOUT);
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

