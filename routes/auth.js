import express, { json } from "express";
import dotenv from "dotenv";
import mysql from "mysql2";
import md5 from "md5";
import jwt from "jsonwebtoken";

dotenv.config();
const router = express.Router();
const secretKey = process.env.JWT_SECRET;

const conn = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

conn.connect(function (err) {
  if (err) {
    console.log("There are some error : " + err);
    return false;
  }else{
    console.log("database is connected");
  }
});

router.post("/login", async (req, res) => {
  const {mellicode,password,is_student}=req.body;
  const passwordHashed = md5(password);

  var token = '';

  if(!is_student){
    try {
      const user = conn.query(`SELECT * FROM users where melliCode = '${mellicode}' AND password = '${passwordHashed}'`,(err,result)=>{
          if(err){
              res.json({
                "success":"false",
                "data":err
              });
              return false;
          }
  
          if(result[0]){
            token=jwt.sign({id:result[0].id,mellicode:result[0].mellicode},process.env.JWT_SECRET, { expiresIn: '24h' });
            res.json({
              "success":"true",
              "data":{
                "userId":result[0].id,
                "tokenType":"user",
                "token":token
              }
            });          
          }else{
            res.json({
              "success":"false",
              "data":"User not found Check the input information"
            })
          }
      });
    } catch (error) {
      res.status(500).json({ error: "Database error" });
    }
  }else{
    try {
      const user = conn.query(`SELECT * FROM students where melliCode = '${mellicode}' AND password = '${passwordHashed}'`,(err,result)=>{
          if(err){
              res.json({
                "success":"false",
                "data":err
              });
              return false;
          }
  
          if(result[0]){
            token=jwt.sign({id:result[0].id,mellicode:result[0].mellicode},process.env.JWT_SECRET, { expiresIn: '24h' });
            res.json({
              "success":"true",
              "data":{
                "studentId":result[0].id,
                "tokenType":"student",
                "token":token,
                "status":result[0].status
              }
            });          
          }else{
            res.json({
              "success":"false",
              "data":"Student not found Check the input information"
            })
          }
      });
    } catch (error) {
      res.status(500).json({ error: "Database error" });
    }
  }

});

export default router;
 