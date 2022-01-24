const express = require('express');
const router = express.Router();
const { pool } = require('../config/db');

router.get('/', async (req, res) =>  {
    const client = await pool.connect();
    try {
        let query = "select * from articles where active = '1' limit 200";
        let values = [];
        const articles = await client.query(query, values);

        res.status(200).send({articles: articles});
    } catch (err) {
        console.log('err', err);
        res.status(500);
        res.send(err.message);
    } finally {
        client.release(true);
    }
});

router.put('/:id', async (req, res) =>  {
    const client = await pool.connect();
    try {
        let ids = req.params.id.split(',');
        console.log('ids', ids);
        for (let index = 0; index < ids.length; index++) {
            const element = ids[index];
            let query = "update articles set active = '0' where id = $1";
            let values = parseInt(element);
            const articles = await client.query(query, values);
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

module.exports = router