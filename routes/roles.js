import express from "express";
import mysql from 'mysql2';
import config from 'config';

const router = express.Router();

const conn = mysql.createConnection({
    host:config.db_connection.host,
    user:config.db_connection.username,
    password:config.db_connection.password,
    database:config.db_connection.db_name
});


router.get('/add',(req,res)=>{
    res.json(conn);
});

export default router;