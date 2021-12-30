const express = require('express');
const router = express.Router();
const { pool } = require('../config/db');

router.get('/', async (req, res) =>  {
    const client = await pool.connect();
    try {
        let query = "select * from categories";
        let values = [];
        const categories = await client.query(query, values);

        res.status(200).send({categories: categories});
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
        let query ="insert into categories (category) values ($1)";
        let values = [req.body.category];
        const insertCategories = await client.query(query, values);
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
        let query ="delete from categories where id = $1";
        let values = [req.params.id];
        const deleteCategories = await client.query(query, values);
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