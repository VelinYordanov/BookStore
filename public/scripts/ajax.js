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

    function submitBookComment() {
        const commentTextArea = document.getElementById('comment-text');
        const submitButton = document.getElementById('comment-button');
        const bookIdInput = document.getElementById('book-id');
        const loadButton = document.getElementById('load-comments');

        if (!(commentTextArea && submitButton && bookIdInput)) {
            return;
        }

        submitButton.addEventListener('click', async event => {
            event.preventDefault();
            const commentText = commentTextArea.value;
            if (commentText.length > 500 || commentText.length < 5) {
                toastr.error("Comment must be between 500 and 5 symbols long");
                return;
            } else {
                const bookId = bookIdInput.value;
                const result = await doPostRequest(`/books/${bookId}/comments`, { comment: commentText });
                console.log(result);
                if (result.status === 200) {
                    const noComments = document.getElementById('no-comments');
                    if (noComments) {
                        noComments.parentElement.removeChild(noComments);
                    }

                    const html = await result.text();
                    if (loadButton) {
                        loadButton.insertAdjacentHTML('beforebegin', html);
                    } else {
                        const commentSection = document.getElementById('comments');
                        commentSection.insertAdjacentHTML('beforeend', html);                        
                    }

                    commentTextArea.value = "";
                    toastr.success('Comment added');
                } else if (result.status === 401) {
                    toastr.error("You need to login in order to comment books");
                    redirect('/login');
                } else if (result.status === 400) {
                    toastr.error('Comment must be between 500 and 5 symbols long');
                }
            }
        })
    }

    function loadMoreComments() {
        const loadButton = document.getElementById('load-comments');
        const bookIdInput = document.getElementById('book-id');
        if (!(loadButton && bookIdInput)) {
            return;
        }

        var isButtonEnabled = true;

        loadButton.addEventListener('click', async () => {
            if (isButtonEnabled) {
                isButtonEnabled = false;
                const currentPage = loadButton.getAttribute('page');
                const bookId = bookIdInput.value;
                const result = await fetch(`/books/${bookId}/comments?page=${currentPage}`);
                const html = await result.text();
                if (!html) {
                    toastr.info('No more comments!');
                    loadButton.parentElement.removeChild(loadButton);
                    return;
                }

                loadButton.setAttribute('page', +currentPage + 1);
                loadButton.insertAdjacentHTML('beforebegin', html);
                toastr.success('Comment added');
                isButtonEnabled = true;
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
    submitBookComment();
    loadMoreComments();
}())

