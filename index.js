const puppeteer = require('puppeteer');
const express = require('express');

const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const PORT = 8000;

app.use(cors());

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

require('./routes')(app);

//https://ordoabchao.ca/articles


//CNN
//document.querySelectorAll(".single-story-module__headline-link")
//document.querySelectorAll(".single-story-module__related-story")
//BLOOMBERG
//document.querySelectorAll(".story-package-module__story__headline")
//document.querySelectorAll(".single-story-module__related-story-link")
//document.querySelectorAll(".story-package-module__story__headline-link")
//document.querySelectorAll(".story-list-story__info__headline-link")
//NEWSCIENTIST
//document.querySelectorAll(".card__content--linked")
//NBC
//document.querySelectorAll(".alacarte__text-wrapper")
//document.querySelectorAll(".tease-card__title")
//CNBC
//document.querySelectorAll(".FeaturedCard-contentText")
//document.querySelectorAll(".SecondaryCard-headline")
//document.querySelectorAll(".RiverPlusCard-container")
//document.querySelectorAll(".Card-textContent")
//DAILYMAILUK
//document.querySelectorAll(".article")
//DAILYSTARUK
//document.querySelectorAll(".pancake + .primary > .teaser")
//THELASTAMERICANVAGABOND
//document.querySelectorAll(".one_half:not(.ichere):not(.test1):not(.test2):not(.testhere):not(.test3):not(.test4):not(.test5), .post_header.half")
//TECHCRUNCH
//document.querySelectorAll("article")
//THEGRAYZONE
//document.querySelectorAll(".title")
//MUCKROCK
//document.querySelectorAll(".article__overview__title, .h2")
async function main () {
    const browser = await puppeteer.launch({
        headless: true,     //esconder o no
        defaultViewport: { width: 1920, height: 1080},
        'args' : [
            '--no-sandbox',
            '--disable-setuid-sandbox'
        ]
    });
    const page = await browser.newPage();

    const keywords = await getKeywords();
    const articles = await getArticles();
    console.log('\n\n\n');
    console.log('keywords', keywords);
    console.log('\n\n\n');
    console.log('articles', articles);
    console.log('\n\n\n');

    /* CNN */

    try{
        await page.goto("https://edition.cnn.com/world");
    }catch(e){
        console.log('1.1', e)
    }
    try{
        await autoScroll(page);
    }catch(e){
        console.log('1.2', e)
    }
    let cnnHeadlinesPage;
    try{
        cnnHeadlinesPage = await page.$$(".cd__headline");
    }catch(e){
        console.log('1.3', e)
    }
    const cnnHeadlines = [];
    try{
        for (let index = 0; index < cnnHeadlinesPage.length; index++) {
            const element = cnnHeadlinesPage[index];
            const article = {headline: '', url: '', site: 'cnn', language: 'eng'};
            const link = await element.$eval('a', a => a.getAttribute('href'));
            article.url = 'https://edition.cnn.com'+link;

            let text = await (await element.getProperty('innerText')).jsonValue();
            text = text.trim();
            if(headlineHasKeyword(keywords.filter((keyword, index) => {return keyword.language.localeCompare('eng')===0 || keyword.language.localeCompare('all')===0}), text) && !headlineAlreadyAdded(cnnHeadlines, text) && !headlineAlreadyAdded(articles, text)){
                article.headline = text;
                cnnHeadlines.push(article);
            }
            /* console.log(index+") ", text);
            console.log(link); */
        }
    }catch(e){
        console.log('1.4', e)
    }
    console.log("/******************************");
    console.log("*********** CNN ***************");
    console.log(cnnHeadlines);
    console.log("*******************************");
    console.log("******************************\\");
    saveArticles(cnnHeadlines);

    

    /* BLOOMBERG */

    try{
        await page.goto("https://www.bloomberg.com/");
    }catch(e){
        console.log('2.1', e)
    }
    try{
        await autoScroll(page);
    }catch(e){
        console.log('2.2', e)
    }

    let bloombergHeadlinesPage;
    try{
        bloombergHeadlinesPage = await page.$$(".single-story-module__headline-link, .single-story-module__related-story-link, .story-package-module__story__headline-link, .story-list-story__info__headline-link");
    }catch(e){
        console.log('2.3', e)
    }
    const bloombergHeadlines = [];
    try{
        for (let index = 0; index < bloombergHeadlinesPage.length; index++) {
            const element = bloombergHeadlinesPage[index];
            const article = {headline: '', url: '', site: 'bloomberg', language: 'eng'};
            const link = await (await element.getProperty('href')).jsonValue();
            article.url = link;

            let text = await (await element.getProperty('innerText')).jsonValue();
            text = text.trim();
            if(headlineHasKeyword(keywords.filter((keyword, index) => {return keyword.language.localeCompare('eng')===0 || keyword.language.localeCompare('all')===0}), text) && !headlineAlreadyAdded(bloombergHeadlines, text) && !headlineAlreadyAdded(articles, text)) {
                article.headline = text;
                bloombergHeadlines.push(article);
            }
            /* console.log(index+") ", text);
            console.log(link); */
        }
    }catch(e){
        console.log('2.4', e)
    }
    console.log("/******************************");
    console.log("*******************************");
    console.log("********* BLOOMBERG ***********");
    console.log(bloombergHeadlines);
    console.log("*******************************");
    console.log("******************************\\");
    saveArticles(bloombergHeadlines);



    /* NEWSCIENTIST */

    try{
        await page.goto("https://www.newscientist.com/");
    }catch(e){
        console.log('3.1', e)
    }
    try{
        await autoScroll(page);
    }catch(e){
        console.log('3.2', e)
    }

    let newScientistHeadlinesPage;
    try{
        newScientistHeadlinesPage = await page.$$(".card__content--linked");
    }catch(e){
        console.log('3.3', e)
    }
    const newScientistHeadlines = [];
    try{
        for (let index = 0; index < newScientistHeadlinesPage.length; index++) {
            const element = newScientistHeadlinesPage[index];
            const article = {headline: '', url: '', site: 'newscientist', language: 'eng'};
            const link = await element.$eval('a', a => a.getAttribute('href'));
            article.url = 'https://www.newscientist.com'+link;

            let text = await (await element.getProperty('innerText')).jsonValue();
            text = text.trim();
            if(headlineHasKeyword(keywords.filter((keyword, index) => {return keyword.language.localeCompare('eng')===0 || keyword.language.localeCompare('all')===0}), text) && !headlineAlreadyAdded(newScientistHeadlines, text) && !headlineAlreadyAdded(articles, text)){
                article.headline = text;
                newScientistHeadlines.push(article);
            }
            /* console.log(index+") ", text);
            console.log(link); */
        }
    }catch(e){
        console.log('3.4', e)
    }
    console.log("/******************************");
    console.log("*******************************");
    console.log("******** NEWSCIENTIST *********");
    console.log(newScientistHeadlines);
    console.log("*******************************");
    console.log("******************************\\");
    saveArticles(newScientistHeadlines);



    /* NBC */

    try{
        await page.goto("https://www.nbcnews.com/");
    }catch(e){
        console.log('4.1', e)
    }
    try{
        await autoScroll(page);
    }catch(e){
        console.log('4.2', e)
    }

    let nbcHeadlinesPage;
    try{
        nbcHeadlinesPage = await page.$$(".alacarte__text-wrapper, .tease-card__title");
    }catch(e){
        console.log('4.3', e)
    }
    const nbcHeadlines = [];
    try{
        for (let index = 0; index < nbcHeadlinesPage.length; index++) {
            const element = nbcHeadlinesPage[index];
            const article = {headline: '', url: '', site: 'nbc', language: 'eng'};
            const link = await element.$eval('a', a => a.getAttribute('href'));
            article.url = link;
            
            let text = await (await element.getProperty('innerText')).jsonValue();
            text = text.trim();
            if(text.split('\n').length>1)
                text = text.split('\n')[1];
            if(headlineHasKeyword(keywords.filter((keyword, index) => {return keyword.language.localeCompare('eng')===0 || keyword.language.localeCompare('all')===0}), text) && !headlineAlreadyAdded(nbcHeadlines, text) && !headlineAlreadyAdded(articles, text)){
                article.headline = text;
                nbcHeadlines.push(article);
            }
            /* console.log(index+") ", text);
            console.log(link); */
        }
    }catch(e){
        console.log('4.4', e)
    }
    console.log("/******************************");
    console.log("*******************************");
    console.log("************* NBC *************");
    console.log(nbcHeadlines);
    console.log("*******************************");
    console.log("******************************\\");
    saveArticles(nbcHeadlines);


    /* CNBC */

    try{
        await page.goto("https://www.cnbc.com/");
    }catch(e){
        console.log('5.1', e)
    }
    try{
        await autoScroll(page);
    }catch(e){
        console.log('5.2', e)
    }

    let cnbcHeadlinesPage;
    try{
        cnbcHeadlinesPage = await page.$$(".FeaturedCard-packagedCardTitle, .PackageItems-container li, .SecondaryCardContainer-container li, .LatestNews-list li, .RiverPlusCard-container, .Card-textContent");
    }catch(e){
        console.log('5.3', e)
    }
    const cnbcHeadlines = [];
    try{
        for (let index = 0; index < cnbcHeadlinesPage.length; index++) {
            const element = cnbcHeadlinesPage[index];
            const article = {headline: '', url: '', site: 'cnbc', language: 'eng'};
            const link = await element.$eval('a:not(.ProPill-proPillLink)', a => a.getAttribute('href'));
            article.url = link;
            
            let text;
            const className = await element.getProperty('className');
            if(className._remoteObject.value.localeCompare('RiverPlusCard-container')===0 || className._remoteObject.value.localeCompare('Card-textContent')===0){
                text = await (await element.getProperty('innerText')).jsonValue();
                if(text.split('\n').length>1)
                    text = text.split('\n')[0];
            } else {
                text = await element.$eval('a:not(.ProPill-proPillLink)', a => a.getAttribute('title'));
            }
            text = text.trim();
            if(headlineHasKeyword(keywords.filter((keyword, index) => {return keyword.language.localeCompare('eng')===0 || keyword.language.localeCompare('all')===0}), text) && !headlineAlreadyAdded(cnbcHeadlines, text) && !headlineAlreadyAdded(articles, text)){
                article.headline = text;
                cnbcHeadlines.push(article);
            }
            /* console.log(index+") ", text);
            console.log(link); */
        }
    }catch(e){
        console.log('5.4', e)
    }
    console.log("/******************************");
    console.log("*******************************");
    console.log("************* CNBC ************");
    console.log(cnbcHeadlines);
    console.log("*******************************");
    console.log("******************************\\");
    saveArticles(cnbcHeadlines);


    /* DAILYMAIL */

    try{
        await page.goto("https://www.dailymail.co.uk/home/latest/index.html");
    }catch(e){
        console.log('6.1', e)
    }
    try{
        await autoScroll(page);
    }catch(e){
        console.log('6.2', e)
    }

    let dailymailukHeadlinesPage;
    try{
        dailymailukHeadlinesPage = await page.$$(".article");
    }catch(e){
        console.log('6.3', e)
    }
    const dailymailukHeadlines = [];
    try{
        for (let index = 0; index < dailymailukHeadlinesPage.length; index++) {
            const element = dailymailukHeadlinesPage[index];
            const article = {headline: '', url: '', site: 'dailymail', language: 'eng'};
            const link = await element.$eval('a:first-child', a => a.getAttribute('href'));
            article.url = 'https://www.dailymail.co.uk'+link;

            let text = await (await element.getProperty('innerText')).jsonValue();
            if(text.split('\n').length>1)
                text = text.split('\n')[0];
            text = text.trim();
            if(headlineHasKeyword(keywords.filter((keyword, index) => {return keyword.language.localeCompare('eng')===0 || keyword.language.localeCompare('all')===0}), text) && !headlineAlreadyAdded(dailymailukHeadlines, text) && !headlineAlreadyAdded(articles, text)){
                article.headline = text;
                dailymailukHeadlines.push(article);
            }
            /* console.log(index+") ", text);
            console.log(link); */
        }
    }catch(e){
        console.log('6.4', e)
    }
    console.log("/******************************");
    console.log("*******************************");
    console.log("********* DAILYMAILUK *********");
    console.log(dailymailukHeadlines);
    console.log("*******************************");
    console.log("******************************\\");
    saveArticles(dailymailukHeadlines);


     /* DAILYSTAR */

    try{
        await page.goto("https://www.dailystar.co.uk/news/latest-news/");
    }catch(e){
        console.log('7.1', e)
    }
    try{
        await autoScroll(page);
    }catch(e){
        console.log('7.2', e)
    }

    let dailystarukHeadlinesPage;
    try{
        dailystarukHeadlinesPage = await page.$$(".pancake + .primary > .teaser");
    }catch(e){
        console.log('7.3', e)
    }
    const dailystarukHeadlines = [];
    try{
        for (let index = 0; index < dailystarukHeadlinesPage.length; index++) {
            const element = dailystarukHeadlinesPage[index];
            const article = {headline: '', url: '', site: 'dailystar', language: 'eng'};
            const link = await element.$eval('a:first-child', a => a.getAttribute('href'));
            article.url = link;

            let text = await (await element.getProperty('innerText')).jsonValue();
            if(text.split('\n').length>1)
                text = text.split('\n')[0];
            text = text.trim();
            if(headlineHasKeyword(keywords.filter((keyword, index) => {return keyword.language.localeCompare('eng')===0 || keyword.language.localeCompare('all')===0}), text) && !headlineAlreadyAdded(dailystarukHeadlines, text) && !headlineAlreadyAdded(articles, text)){
                article.headline = text;
                dailystarukHeadlines.push(article);
            }
            /* console.log(index+") ", text);
            console.log(link); */
        }
    }catch(e){
        console.log('7.4', e)
    }
    console.log("/******************************");
    console.log("*******************************");
    console.log("********* DAILYSTARUK *********");
    console.log(dailystarukHeadlines);
    console.log("*******************************");
    console.log("******************************\\");
    saveArticles(dailystarukHeadlines);


    /* THELASTAMERICANVAGABOND */

    try{
        await page.goto("https://www.thelastamericanvagabond.com/");
    }catch(e){
        console.log('8.1', e)
    }
    try{
        await autoScroll(page);
    }catch(e){
        console.log('8.2', e)
    }

    let thelastamericanvagabondHeadlinesPage;
    try{
        thelastamericanvagabondHeadlinesPage = await page.$$(".one_half:not(.ichere):not(.test1):not(.test2):not(.testhere):not(.test3):not(.test4):not(.test5), .post_header.half");
    }catch(e){
        console.log('8.3', e)
    }
    const thelastamericanvagabondHeadlines = [];
    try{
        for (let index = 0; index < thelastamericanvagabondHeadlinesPage.length; index++) {
            const element = thelastamericanvagabondHeadlinesPage[index];
            const article = {headline: '', url: '', site: 'thelastamericanvagabond', language: 'eng'};
            const link = await element.$eval('a:first-child', a => a.getAttribute('href'));
            article.url = link;

            let text = await element.$eval('a:first-child', a => a.getAttribute('title'));
            text = text.trim();
            if(headlineHasKeyword(keywords.filter((keyword, index) => {return keyword.language.localeCompare('eng')===0 || keyword.language.localeCompare('all')===0}), text) && !headlineAlreadyAdded(thelastamericanvagabondHeadlines, text) && !headlineAlreadyAdded(articles, text)){
                article.headline = text;
                thelastamericanvagabondHeadlines.push(article);
            }
            /* console.log(index+") ", text);
            console.log(link); */
        }
    }catch(e){
        console.log('8.4', e)
    }
    console.log("/******************************");
    console.log("*******************************");
    console.log("*** THELASTAMERICANVAGABOND ***");
    console.log(thelastamericanvagabondHeadlines);
    console.log("*******************************");
    console.log("******************************\\");
    saveArticles(thelastamericanvagabondHeadlines);


    /* TECHCRUNCH */

    try{
        await page.goto("https://techcrunch.com/");
    }catch(e){
        console.log('9.1', e)
    }
    try{
        await autoScroll(page);
    }catch(e){
        console.log('9.2', e)
    }

    let techcrunchHeadlinesPage;
    try{
        techcrunchHeadlinesPage = await page.$$("article");
    }catch(e){
        console.log('9.3', e)
    }
    const techcrunchHeadlines = [];
    try{
        for (let index = 0; index < techcrunchHeadlinesPage.length; index++) {
            const element = techcrunchHeadlinesPage[index];
            const article = {headline: '', url: '', site: 'techcrunch', language: 'eng'};
            const link = await element.$eval('a:first-child', a => a.getAttribute('href'));
            article.url = 'https://techcrunch.com'+link;

            let text = await (await element.getProperty('innerText')).jsonValue();
            if(text.split('\n').length>1)
                text = text.split('\n')[0];
            text = text.trim();
            if(headlineHasKeyword(keywords.filter((keyword, index) => {return keyword.language.localeCompare('eng')===0 || keyword.language.localeCompare('all')===0}), text) && !headlineAlreadyAdded(techcrunchHeadlines, text) && !headlineAlreadyAdded(articles, text)){
                article.headline = text;
                techcrunchHeadlines.push(article);
            }
            /* console.log(index+") ", text);
            console.log(link); */
        }
    }catch(e){
        console.log('9.4', e)
    }
    console.log("/******************************");
    console.log("*******************************");
    console.log("********* TECHCRUNCH **********");
    console.log(techcrunchHeadlines);
    console.log("*******************************");
    console.log("******************************\\");
    saveArticles(techcrunchHeadlines);


    /* GRAYZONE */

    try{
        await page.goto("https://thegrayzone.com/");
    }catch(e){
        console.log('10.1', e)
    }
    try{
        await autoScroll(page);
    }catch(e){
        console.log('10.2', e)
    }

    let thegrayzoneHeadlinesPage;
    try{
        thegrayzoneHeadlinesPage = await page.$$(".title:not(.block-title)");
    }catch(e){
        console.log('10.3', e)
    }
    const thegrayzoneHeadlines = [];
    try{
        for (let index = 0; index < thegrayzoneHeadlinesPage.length; index++) {
            const element = thegrayzoneHeadlinesPage[index];
            const article = {headline: '', url: '', site: 'thegrayzone', language: 'eng'};
            const link = await element.$eval('a', a => a.getAttribute('href'));
            article.url = link;

            let text = await (await element.getProperty('innerText')).jsonValue();
            if(text.split('\n').length>1)
                text = text.split('\n')[0];
            text = text.trim();
            if(headlineHasKeyword(keywords.filter((keyword, index) => {return keyword.language.localeCompare('eng')===0 || keyword.language.localeCompare('all')===0}), text) && !headlineAlreadyAdded(thegrayzoneHeadlines, text) && !headlineAlreadyAdded(articles, text)){
                article.headline = text;
                thegrayzoneHeadlines.push(article);
            }
            /* console.log(index+") ", text);
            console.log(link); */
        }
    }catch(e){
        console.log('10.4', e)
    }
    console.log("/******************************");
    console.log("*******************************");
    console.log("********* THEGRAYZONE *********");
    console.log(thegrayzoneHeadlines);
    console.log("*******************************");
    console.log("******************************\\");
    saveArticles(thegrayzoneHeadlines);


    /* MUCKROCK */

    try{
        await page.goto("https://www.muckrock.com/news/");
    }catch(e){
        console.log('11.1', e)
    }
    try{
        await autoScroll(page);
    }catch(e){
        console.log('11.2', e)
    }

    let muckrockHeadlinesPage;
    try{
        muckrockHeadlinesPage = await page.$$(".article__overview__title, .h2");
    }catch(e){
        console.log('11.3', e)
    }
    const muckrockHeadlines = [];
    try{
        for (let index = 0; index < muckrockHeadlinesPage.length; index++) {
            const element = muckrockHeadlinesPage[index];
            const article = {headline: '', url: '', site: 'muckrock', language: 'eng'};
            const link = await element.$eval('a', a => a.getAttribute('href'));
            article.url = link;

            let text = await (await element.getProperty('innerText')).jsonValue();
            if(text.split('\n').length>1)
                text = text.split('\n')[0];
            text = text.trim();
            if(headlineHasKeyword(keywords.filter((keyword, index) => {return keyword.language.localeCompare('eng')===0 || keyword.language.localeCompare('all')===0}), text) && !headlineAlreadyAdded(muckrockHeadlines, text) && !headlineAlreadyAdded(thelastamericanvagabondHeadlines, text) && !headlineAlreadyAdded(articles, text)){
                article.headline = text;
                muckrockHeadlines.push(article);
            }
            /* console.log(index+") ", text);
            console.log(link); */
        }
    }catch(e){
        console.log('11.4', e)
    }
    console.log("/******************************");
    console.log("*******************************");
    console.log("********** MUCKROCK ***********");
    console.log(muckrockHeadlines);
    console.log("*******************************");
    console.log("******************************\\");
    saveArticles(muckrockHeadlines);

    await browser.close();
}

async function getArticles(){
    const { pool } = require('./config/db');
    const client = await pool.connect();
    try {
        let query = "select * from articles where active = '0'";
        let values = [];
        const articles = await client.query(query, values);

        return articles.rows;
    } catch (err) {
        client.release(true);
        console.log('err', err);
    } finally {
        client.release(true);
    }
}

async function getKeywords(){
    const { pool } = require('./config/db');
    const client = await pool.connect();
    try {
        let query = "select * from keywords";
        let values = [];
        const keywords = await client.query(query, values);

        return keywords.rows;
    } catch (err) {
        client.release(true);
        console.log('err', err);
    } finally {
        client.release(true);
    }
}

async function saveArticles(headlines){
    const { pool } = require('./config/db');
    const client = await pool.connect();
    try {
        for (let index = 0; index < headlines.length; index++) {
            const headline = headlines[index];
            let query = "insert into articles (headline, url, site, language, active) values ($1, $2, $3, $4, $5)";
            let values = [headline.headline, headline.url, headline.site, headline.language, 1];
            const savedheadlines = await client.query(query, values);
        }
    } catch (err) {
        client.release(true);
        console.log('err', err);
    } finally {
        client.release(true);
    }
}

async function autoScroll(page){
    await page.evaluate(async () => {
        await new Promise((resolve, reject) => {
            var totalHeight = 0;
            var distance = 100;
            var timer = setInterval(() => {
                var scrollHeight = document.body.scrollHeight;
                window.scrollBy(0, distance);
                totalHeight += distance;

                if(totalHeight >= scrollHeight){
                    clearInterval(timer);
                    resolve();
                }
            }, 100);
        });
    });
}

function headlineHasKeyword(keywords, headline) {
    for (let index = 0; index < keywords.length; index++) {
        const keyword = keywords[index];
        if(headline.toLowerCase().includes(keyword.word.toLowerCase())){
            return true;
        }
    }
    return false;
}

function headlineAlreadyAdded(headlines, headline) {
    for (let index = 0; index < headlines.length; index++) {
        const savedHeadline = headlines[index].headline;
        if(headline.toLowerCase().includes(savedHeadline.toLowerCase())){
            return true;
        }
    }
    return false;
}

function isLastDay(dt) {
    var test = new Date(dt.getTime()),
        month = test.getMonth();
    test.setDate(test.getDate() + 1);
    return test.getMonth() !== month;
}

async function clearArticles () {
    const { pool } = require('./config/db');
    const client = await pool.connect();
    try {
        let query = "delete from articles where active = 'false'";
        let values = [];
        const articles = await client.query(query, values);
    } catch (err) {
        client.release(true);
        console.log('err', err);
    } finally {
        client.release(true);
    }
}

mainFunctionTimer();

async function mainFunctionTimer () {
    main();
    setInterval(() => {
        main();
        const today = new Date();
        if(isLastDay(today))
            clearArticles();
    }, 14400000);
    //5 minutos: 300000
    //4 horas: 14400000
}

app.listen(process.env.PORT || PORT, () => {
    console.log('Listening at ' + PORT );
});