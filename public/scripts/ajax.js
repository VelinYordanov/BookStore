(function () {
    const id = location.href.split('/').pop();
    function addBookToCart() {
        const addToCartButton = document.getElementById('add-book-to-cart');
        if (!addToCartButton) {
            return;
        }

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
                        } else if (result.status === 200) {
                            toastr.info('Book already in cart');
                        } else if (result.status === 401) {
                            toastr.error("You need to login to purchase books");
                            redirect('/login')
                        }
                    } catch {

                    } finally {
                        isButtonEnabled = true;
                    }
                } else {
                    toastr.error('Ooops, something went wrong. Try again later.');
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
        if (!favoriteBookButton) {
            return;
        }

        var isButtonEnabled = true;

        favoriteBookButton.addEventListener('click', async () => {
            if (isButtonEnabled) {
                isButtonEnabled = false;
                try {
                    const result = await doPostRequest(url, { id });
                    console.log(result);
                    if (result.status === 200) {
                        toastr.success("Success");
                        favoriteBookButton.classList.toggle('fas');
                        favoriteBookButton.classList.toggle('far');
                        if (favoriteBookButton.classList.contains('fas')) {
                            document.getElementById('favorites-count').textContent = +document.getElementById('favorites-count').textContent + 1;
                        } else {
                            document.getElementById('favorites-count').textContent = +document.getElementById('favorites-count').textContent - 1;
                        }
                    } else {
                        toastr.error("You need to register in order to favorite items");
                        redirect('/login');
                    }
                } catch {
                    toastr.error('Ooops, something went wrong. Try again later.')
                } finally {
                    isButtonEnabled = true;
                }
            }
        })
    }

    function purchaseBooks() {
        const purchaseButton = document.getElementById('purchase');
        if (!purchaseButton) {
            return;
        }

        purchaseButton.addEventListener('click', async () => {
            const result = await doPostRequest('/cart', {});
            console.log(result);
            if (result.status === 201) {
                toastr.success("Purchased books!");
                redirect('/profile');
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
            location.replace(url);
        }, REDIRECT_TIMEOUT);
    }

    addBookToFavorites();
    addAuthorToFavorites();
    addBookToCart();
    purchaseBooks();
}())

