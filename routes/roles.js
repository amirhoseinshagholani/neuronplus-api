import express, { json } from "express";
import mysql from 'mysql2';
import config from 'config';
import dotenv from 'dotenv';
import jwt from "jsonwebtoken";
dotenv.config();

const router = express.Router();

const conn = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

router.get('/get/all',(req,res)=>{
    if(!req.headers['authorization']){
        res.json({
            "success":"false",
            "data":"Token is required",
        });
        return false;
    }

    const token = req.headers['authorization'];
    jwt.verify(token.split(' ')[1],process.env.JWT_SECRET,(err,decode)=>{
        if(err){
            res.json({
                "success":"false",
                "data":"The token is incorrect"
            });
            return false;
        }
        conn.query("SELECT * FROM roles",(err,result)=>{
            if(err){
                console.log("sorry");
                return;
            } 
            
            res.json({
                "success":"true",
                "data": result
            })
        })
    })

});

export default router;