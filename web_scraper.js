const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');

let scrapedData = [];

const scrapePage = async (url) => {
    try {
        const response = await axios.get(url);
        const $ = cheerio.load(response.data);

        $('.review-card').each((index, element) => {
            const companyProfile = $(element).find('.reviewer-company-profile').text().trim();
            const rating = $(element).find('.rating').text().trim();
            const likes = $(element).find('.what-do-you-like-best').text().trim();
            const dislikes = $(element).find('.what-do-you-dislike').text().trim();

            scrapedData.push({ companyProfile, rating, likes, dislikes });
        });

        const nextPageLink = $('.pagination-next').attr('href');
        if (nextPageLink) {
            await scrapePage(`https://www.g2.com${nextPageLink}`);
        } else {
            fs.writeFileSync('scraped_data.json', JSON.stringify(scrapedData, null, 2));
        }
    } catch (error) {
        console.error(`Failed to scrape data from page: ${url}\n`, error);
    }
};

const startScraping = async () => {
    const url = 'https://www.g2.com/product/reviews';
    await scrapePage(url);
};

startScraping();