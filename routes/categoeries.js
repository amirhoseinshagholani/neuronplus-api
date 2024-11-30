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

router.get("/get/all", (req, res) => {
  if (!req.headers["authorization"]) {
    res.json({
      success: "false",
      data: "Token is required",
    });
    return false;
  }

  const token = req.headers["authorization"];
  jwt.verify(token.split(" ")[1], process.env.JWT_SECRET, (err, decode) => {
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
});

router.post("/add", (req, res) => {
  if (!req.headers["authorization"]) {
    res.json({
      success: "false",
      data: "Token is required",
    });
    return false;
  }

  const token = req.headers["authorization"];

  jwt.verify(token.split(" ")[1], process.env.JWT_SECRET, (err, decode) => {
    if (err) {
      res.status(400).json({
        success: "false",
        data: "The token is incorrect",
      });
      return false;
    }

    const refer_to = decode.id;

    if (!req.body.title) {
      res.json({
        success: "false",
        data: "title is required",
      });
      return false;
    }
    if (!req.body.status) {
      res.json({
        success: "false",
        data: "status is required",
      });
      return false;
    }
    if (!req.body.cover) {
      res.json({
        success: "false",
        data: "type is required",
      });
      return false;
    }

    if (!req.body.video) {
      res.json({
        success: "false", 
        data: "video is required",
      });
      return false;
    }

    if (!req.body.comment) {
      res.json({
        success: "false", 
        data: "comment is required",
      });
      return false;
    }

    if (!req.body.description) {
      res.json({
        success: "false", 
        data: "description is required",
      });
      return false;
    }

    const today = getToday();

    conn.query(
      `INSERT INTO categories(title,status,cover,video,comment,description,refer_to,created_at,updated_at)
          VALUES('${req.body.title}','${req.body.status}','${req.body.cover}','${req.body.video}','${req.body.comment}','${req.body.description}','${refer_to}','${today}','${today}')`,
      (err, result) => {
        if (err) {
          res.json({
            success: "false",
            data: err,
          });
          return false;
        }
        res.json({
          success: "true",
          data: "The category was inserted successfully",
        });
      }
    );
  });
});

export default router;
