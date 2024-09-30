import express from 'express';
import dotenv from 'dotenv';
import mysql from 'mysql2';
import config from 'config';

dotenv.config();
const router = express.Router();

const conn = mysql.createConnection({
    host:config.db_connection.host,
    user:config.db_connection.username,
    password:config.db_connection.password,
    database:config.db_connection.db_name
});

const secretKey = process.env.JWT_SECRET;

router.get('/getToken', async (req, res) => {
    try {
        const results = await conn.query("SELECT * FROM api_users");
        console.log(results);
        res.json(results); // پاسخ مناسب به کاربر ارسال می‌شود
    } catch (error) {
        res.status(500).json({ error: 'Database error' });
    }
});

export default router;