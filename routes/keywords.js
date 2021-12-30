const express = require('express');
const { ConsoleMessage } = require('puppeteer');
const router = express.Router();
const { pool } = require('../config/db');

router.get('/', async (req, res) =>  {
    const client = await pool.connect();
    try {
        let query = "select * from keywords";
        let values = [];
        const keywords = await client.query(query, values);

        res.status(200).send({keywords: keywords});
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
        let query ="insert into keywords (word, language) values ($1, $2)";
        let values = [req.body.word, req.body.language];
        const insertKeyword = await client.query(query, values);
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
        let query ="delete from keywords where id = $1";
        let values = [req.params.id];
        const deleteKeyword = await client.query(query, values);
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