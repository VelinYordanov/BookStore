const ROOT_URL = 'https://www.goodreads.com/';

async function something() {
    const data = await require('./data');
    const Author = require('./data/models/author');
    const Book = require('./data/models/book');

    const getContent = function (url) {
        return new Promise((resolve, reject) => {
            const lib = url.startsWith('https') ? require('https') : require('http');
            const request = lib.get(url, (response) => {
                if (response.statusCode < 200 || response.statusCode > 299) {
                    reject(new Error('Failed to load page, status code: ' + response.statusCode));
                }

                const body = [];
                response.on('data', (chunk) => body.push(chunk));
                response.on('end', () => resolve(body.join('')));
            });

            request.on('error', (err) => reject(err))
        })
    };

    function getImage(url) {
        return new Promise((resolve, reject) => {
            const https = require('https');
            var Stream = require('stream').Transform;
            var stream = new Stream();
            https.get(url, (response) => {
                response.on('data', chunk => stream.push(chunk));
                response.on('end', () => resolve(stream.read()))
            })
        })
    }

    async function addBook(href) {
        const url = ROOT_URL + href;
        const bookHtml = await getContent(url);
        const cheerio = require('cheerio');
        const $ = cheerio.load(bookHtml);
        const authorLink = $($('#aboutAuthor .bookAuthorProfile__name a')[0]).attr('href');
        var author = await getAuthor(authorLink);
        const bookTitle = $('#bookTitle').text().trim();
        const bookDescription = $($('#description span')[1]).text().trim();
        const isbn = $($('span[itemprop=isbn]')[0]).text();
        const bookCover = await getImage($('#coverImage').attr('src'));
        const book = new Book(bookTitle, bookDescription, 30, { id: author._id, name: author.name }, isbn, bookCover);
        author.books.push(book);
        await Promise.all([data.authors.update(author._id, author), data.books.add(book)]);
    }

    async function getAuthor(href) {
        const url = ROOT_URL + href;
        const authorHtml = await getContent(url);
        const cheerio = require('cheerio');
        const $ = cheerio.load(authorHtml);
        const authorName = $($('.authorName > span')[0]).text();
        var authorBio = $($('.aboutAuthorInfo > span')[1]).text();
        if (!authorBio) {
            authorBio = $($('.aboutAuthorInfo > span')[0]).text();
        }

        const authorImageUrl = $($(`img[alt="${authorName}"]`)[0]).attr('src');
        const authorImage = await getImage(authorImageUrl);
        let authors = await data.authors.searchAuthors(authorName);
        if (authors.length) {
            return authors[0];
        }

        return (await data.authors.add(new Author(authorName, authorBio, authorImage))).ops[0];
    }

    const html = await getContent('https://www.goodreads.com/choiceawards/best-fiction-books-2017');
    const cheerio = require('cheerio');
    const $ = cheerio.load(html);
    const bookHrefs = [];

    $('.pollAnswer__bookLink').each((_, element) => {
        bookHrefs.push($(element).attr('href'))
    })

    await Promise.all(bookHrefs.map(addBook));
}

something().then(async _ => await process.exit());
