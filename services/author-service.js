module.exports = bookStoreData => {
    async function getAuthorsAsync(skip, take) {
        const authors = await bookStoreData.authors.findMany(skip, take);
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
            return author;
        } catch {
            return
        }
    }

    const authorService = () => { };
    authorService.getAuthorsAsync = getAuthorsAsync;
    authorService.getAllAuthorsCount = getAllAuthorsCount;
    authorService.getAuthor = getAuthor;
    return authorService;
}