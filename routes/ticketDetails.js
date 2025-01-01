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

router.get("/getTicketDetailsWithTicketId", (req, res) => {
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
    if (!req.query.ticket_id) {
      res.json({
        success: "false",
        data: "ticket_id is required",
      });
      return false;
    }
  
    const ticket_id = req.query.ticket_id;

    conn.query(`SELECT * FROM ticket_details where ticket_id='${ticket_id}'`, (err, result) => {
      if (err) {
        res.json({
          success: "false",
          data: "There is a problem with the database",
        });
        return;
      }
      res.json({
        success: "true",
        data: result.length != 0 ? result : "ticketDetails are Empty",
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
    
    const user_id = decode.id;

    if (!req.body.ticket_id) {
      res.json({
        success: "false",
        data: "ticket_id is required",
      });
      return false;
    }
  
    if (!req.body.answerType) {
      res.json({
        success: "false",
        data: "answerType is required",
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
      `INSERT INTO ticket_details(ticket_id,user_id,answerType,description,created_at,updated_at)
        VALUES('${req.body.ticket_id}','${user_id}','${req.body.answerType}','${req.body.description}','${today}','${today}')`,
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
          data: "The ticketDetails was inserted successfully",
        });
      }
    );
  });
});



export default router;
