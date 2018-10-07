const ROOT_URL = 'https://www.goodreads.com';
const urls =
    [
        'https://www.goodreads.com/choiceawards/best-fantasy-books-2017',
        'https://www.goodreads.com/choiceawards/best-horror-books-2017',
        'https://www.goodreads.com/choiceawards/best-science-fiction-books-2017'
    ]

async function seed() {
    const https = require('https');
    const data = await require('./data');
    const Author = require('./data/models/author');
    const Book = require('./data/models/book');

    const getContent = function (url) {
        return new Promise((resolve, reject) => {
            const request = https.get(url, (response) => {
                if (response.statusCode < 200 || response.statusCode > 299) {
                    reject(new Error('Failed to load page, status code: ' + response.statusCode));
                }

                const body = [];
                response.on('data', (chunk) => body.push(chunk));
                response.on('end', () => resolve(body.join('')));
            });

            request.on('error', (err) => reject(err));
        })
    };


    function getImage(url) {
        return new Promise((resolve, reject) => {
            var Stream = require('stream').Transform;
            var stream = new Stream();
            const request = https.get(url, (response) => {
                response.on('data', chunk => stream.push(chunk));
                response.on('end', () => resolve(stream.read()))
            })

            request.on('error', err => reject(err));
        })
    }

    async function getData(href) {
        const url = ROOT_URL + href;
        try {
            var bookHtml = await getContent(url);
        } catch {
            return;
        }

        const cheerio = require('cheerio');
        const $ = cheerio.load(bookHtml);
        const authorLink = $($('#aboutAuthor .bookAuthorProfile__name a')[0]).attr('href');
        await getAuthor(authorLink);
    }

    async function addBook(href, author) {
        const url = ROOT_URL + href;
        var bookHtml;
        try {
            bookHtml = await getContent(url);
        } catch {
            return;
        }

        const cheerio = require('cheerio');
        const $ = cheerio.load(bookHtml);
        const bookTitle = $('#bookTitle').text().trim();
        const bookDescription = $($('#description span')[1]).text().trim() || $($('#description span')[0]).text().trim();
        const isbn = $($('span[itemprop=isbn]')[0]).text();
        if (!(bookDescription && isbn)) {
            return;
        }

        const bookCoverUrl = $('#coverImage').attr('src');
        var bookCover;
        try {
            bookCover = await getImage(bookCoverUrl);
        } catch {
            return;
        }

        try {
            const book = new Book(bookTitle, bookDescription, 30, { id: author._id, name: author.name }, isbn, bookCover);
            author.books.push(book);
            await Promise.all([data.authors.update(author._id, author), data.books.add(book)]);
        } catch {
            return;
        }
    }

    async function getAuthor(href) {
        const url = ROOT_URL + href;
        var authorHtml;
        try {
            authorHtml = await getContent(url);
        } catch {
            return;
        }

        const cheerio = require('cheerio');
        const $ = cheerio.load(authorHtml);
        const authorName = $($('.authorName > span')[0]).text();
        const authorBio = $($('.aboutAuthorInfo > span')[1]).text() || $($('.aboutAuthorInfo > span')[0]).text();
        if (!authorBio) {
            return
        }

        const authorImageUrl = $($(`img[alt="${authorName}"]`)[0]).attr('src');
        var authorImage;
        try {
            authorImage = await getImage(authorImageUrl);
        } catch {
            return;
        }

        var authors = await data.authors.searchAuthors(authorName);
        var author;
        if (authors.length) {
            author = authors[0];
        } else {
            author = (await data.authors.add(new Author(authorName, authorBio, authorImage))).ops[0];
        }

        var bookHrefs = $('.tableList a.bookTitle').map((_, element) => $(element).attr('href')).get();
        await Promise.all(bookHrefs.map(x => addBook(x, author)));
    }

    async function start(url) {
        console.log(`Fetching ${url}`);
        var html;
        try {
            html = await getContent(url);
        } catch {
            console.log(`Problem fetching data from ${url}. Retrying...`);
            await start(url);
            return;
        }

        const cheerio = require('cheerio');
        const $ = cheerio.load(html);
        const bookHrefs = [];

        $('.pollAnswer__bookLink').each((_, element) => {
            bookHrefs.push($(element).attr('href'))
        })

        await Promise.all(bookHrefs.map(getData));
    }

    for (const url of urls) {
        await start(url);
    }

    await data.authors.deleteAuthorsWithoutBooks();
}

seed().then(() => process.exit());
