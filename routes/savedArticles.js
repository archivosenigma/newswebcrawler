const express = require('express');
const router = express.Router();
const { pool } = require('../config/db');

router.get('/', async (req, res) =>  {
    const client = await pool.connect();
    try {
        const query = "select * from savedarticles";
        const values = [];
        const articles = await client.query(query, values);
        for (let index = 0; index < articles.rows.length; index++) {
            const queryTopics = "select * from categories C where C.id in (select AC.categoryid from savedarticlecategories AC where savedarticleid = $1)";
            const valuesTopics = [articles.rows[index].id];
            const topics = await client.query(queryTopics, valuesTopics);
            articles.rows[index].topics = topics.rows;
        }
        res.status(200).send({articles: articles});
    } catch (err) {
        console.log('err', err);
        res.status(500);
        res.send(err.message);
    } finally {
        client.release(true);
    }
});

router.post('/', async (req, res) =>  {
    const client = await pool.connect();
    try {
        const queryArticle ="insert into savedarticles (headline, url, site, language) values ($1, $2, $3, $4) RETURNING id";
        const valuesArticle = [req.body.headline, req.body.url, req.body.site, req.body.language];
        const insertArticle = await client.query(queryArticle, valuesArticle);
        const categories = req.body.categories;
        console.log('categories', categories)
        console.log('insertArticle', insertArticle)
        for (let index = 0; index < categories.length; index++) {
            const category = categories[index];
            const queryArticleCategories ="insert into savedarticlecategories (savedarticleid, categoryid) values ($1, $2)";
            console.log('category', category)
            console.log('insertArticle.rows[0].id', insertArticle.rows[0].id)
            const valuesArticleCategories = [insertArticle.rows[0].id, category.id];
            const insertArticleCategory = await client.query(queryArticleCategories, valuesArticleCategories);
        }
        res.status(200).send();
    } catch (err) {
        console.log('err', err);
        res.status(500);
        res.send(err.message);
    } finally {
        client.release(true);
    }
});

router.delete('/:id', async (req, res) =>  {
    const client = await pool.connect();
    try {
        const queryArticle ="delete from savedarticles where id = $1";
        const valuesArticle = [req.params.id];
        const deleteArticle = await client.query(queryArticle, valuesArticle);
        res.status(200).send();
    } catch (err) {
        console.log('err', err);
        res.status(500);
        res.send(err.message);
    } finally {
        client.release(true);
    }
});

module.exports = router