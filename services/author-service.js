module.exports = bookStoreData => {
    const SORTING_OPTIONS =
        [
            { name: 'favorites', data: bookStoreData.authors.findTopAuthors.bind(bookStoreData.authors) }
        ]

    async function getAuthorsAsync(skip, take, sort) {
        var authors;
        const option = SORTING_OPTIONS.find(x => x.name === sort);
        if (option) {
            authors = await option.data(skip, take);
        } else {
            authors = await bookStoreData.authors.findMany(skip, take);
        }

        authors.forEach(element => {
            element.picture = element.picture.toString('base64');
        });

        return authors;
    }

    function getAllAuthorsCount() {
        return bookStoreData.authors.count();
    }

    async function getAuthor(id) {
        try {
            const author = await bookStoreData.authors.find(id);
            author.picture = author.picture.toString('base64');
            author.books.forEach(book => {
                book.cover = book.cover.toString('base64');
            })
            return author;
        } catch {
            return
        }
    }

    async function favoriteAuthor(authorId, userId) {
        const author = await bookStoreData.authors.find(authorId);
        const authorToAdd = { name: author.name, picture: author.picture, id: author._id }

        if (author.favorittedBy.includes(userId)) {
            return await Promise.all(
                [
                    bookStoreData.authors.removeUserFromFavorittedBy(authorId, userId),
                    bookStoreData.users.removeAuthorFromFavorites(authorToAdd, userId)
                ]
            );
        }

        return await Promise.all(
            [
                bookStoreData.authors.addUserToFavorittedBy(authorId, userId),
                bookStoreData.users.addAuthorToFavorites(authorToAdd, userId)
            ]
        );
    }

    const authorService = () => { };
    authorService.getAuthorsAsync = getAuthorsAsync;
    authorService.getAllAuthorsCount = getAllAuthorsCount;
    authorService.getAuthor = getAuthor;
    authorService.favoriteAuthor = favoriteAuthor;
    return authorService;
}