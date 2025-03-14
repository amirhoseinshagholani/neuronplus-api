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
  conn.query("SELECT * FROM events", (err, result) => {
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

router.get("/get/event", (req, res) => {
  if (!req.query.id) {
    res.json({
      success: "false",
      data: "event_id is required",
    });
    return false;
  }

  conn.query(`SELECT * FROM events WHERE id=${req.query.id}`, (err, result) => {
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

    if (!req.body.subject) {
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
    if (!req.body.description) {
      res.json({
        success: "false",
        data: "description is required",
      });
      return false;
    }

    const today = getToday();

    conn.query(
      `INSERT INTO events(subject,status,description,refer_to,created_at,updated_at)
          VALUES('${req.body.subject}','${req.body.status}','${req.body.description}','${refer_to}','${today}','${today}')`,
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
          data: "The event was inserted successfully",
        });
      }
    );
  });
});

export default router;
