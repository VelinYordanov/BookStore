const ROOT_URL = 'https://www.goodreads.com/';

async function something() {
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
        console.log(url);
        return new Promise((resolve, reject) => {
            const https = require('https');
            const fs = require('fs');
            //STREAM
            let buffer = '';
            https.get(url, (response) => {
                console.log(response.body);
                response.on('data', chunk => buffer += chunk);
                response.on('end', () => resolve(console.log(Buffer.from(buffer,'utf8'))))
            })
        })
    }

    async function addBook(href) {
        const url = ROOT_URL + href;
        const bookHtml = await getContent(url);
        const cheerio = require('cheerio');
        const $ = cheerio.load(bookHtml);
        const authorLink = $($('#aboutAuthor .bookAuthorProfile__name a')[0]).attr('href');
        await addAuthor(authorLink);
    }

    async function addAuthor(href) {
        const url = ROOT_URL + href;
        const authorHtml = await getContent(url);
        const cheerio = require('cheerio');
        const $ = cheerio.load(authorHtml);
        const authorName = $($('.authorName > span')[0]).text();
        const authorBio = $($('.aboutAuthorInfo > span')[1]).text();
        const authorImageUrl = $($(`img[alt="${authorName}"]`)[0]).attr('src');
        await getImage(authorImageUrl);
        console.log(authorName);
        console.log(authorBio);
    }

    const html = await getContent('https://www.goodreads.com/choiceawards/best-fiction-books-2017');
    const cheerio = require('cheerio');
    const $ = cheerio.load(html);
    const bookHrefs = [];

    $('.pollAnswer__bookLink').each((x, element) => {
        bookHrefs.push($(element).attr('href'))
    })

    //await Promise.all(bookHrefs.map(addBook));
    await addBook(bookHrefs[0]);
}

something().then(x => console.log('done'));
