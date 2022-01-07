const { Pool } = require('pg')
const result = require('dotenv').config({path: './local.env'});

const pool = new Pool({
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    host: process.env.DB_SERVER,
    database: process.env.DB_DATABASE,
    port: 5432,
    max: 10,
    ssl: true
})

module.exports = {
    pool
}