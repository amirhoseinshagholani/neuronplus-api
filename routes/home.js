import express, { json } from "express";
import mysql from "mysql2";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import { getToday } from "../assets/functions.js";
dotenv.config();

const router = express.Router();

const conn = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

router.get("/categoeis/get/all", (req, res) => {
  conn.query("SELECT * FROM categories", (err, result) => {
    if (err) {
      res.json({
        success: "false",
        data: err,
      });
      return false;
    }
    conn.query("SELECT * FROM categories", (err, result) => {
      if (err) {
        res.json({
          success: "false",
          data: "There is a problem with the database",
        });
        return;
      }
      res.json({
        success: "true",
        data: result,
      });
    });
  });

  // const token = req.headers["authorization"];
  //   jwt.verify(token.split(" ")[1], process.env.JWT_SECRET, (err, decode) => {
  //     if (err) {
  //       res.json({
  //         success: "false",
  //         data: err,
  //       });
  //       return false;
  //     }
  //     conn.query("SELECT * FROM categories", (err, result) => {
  //       if (err) {
  //         res.json({
  //           success: "false",
  //           data: "There is a problem with the database",
  //         });
  //         return;
  //       }
  //       res.json({
  //         success: "true",
  //         data: result,
  //       });
  //     });
  //   });
});

export default router;
