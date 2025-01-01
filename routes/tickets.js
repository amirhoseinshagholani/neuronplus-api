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
    conn.query("SELECT * FROM tickets", (err, result) => {
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

router.get("/getOneTicket", (req, res) => {
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
    const id = req.query.ticket_id;
    conn.query(`SELECT * FROM tickets where id='${id}'`, (err, result) => {
      if (err) {
        res.json({
          success: "false",
          data: "There is a problem with the database",
        });
        return;
      }
      res.json({
        success: "true",
        data: result.length != 0 ? result : "Ticket not found",
      });
    });
  });
});

router.get("/getCustomerTickets", (req, res) => {
  if (!req.headers["authorization"]) {
    res.json({
      success: "false",
      data: "Token is required",
    });
    return false;
  }

  const token = req.headers["authorization"];
  // const customer_id = req.query.customer_id;

  jwt.verify(token.split(" ")[1], process.env.JWT_SECRET, (err, decode) => {
    if (err) {
      res.json({
        success: "false",
        data: err,
      });
      return false;
    }

    const customer_id = decode.id;

    conn.query(
      `SELECT * FROM tickets where customer_id='${customer_id}'`,
      (err, result) => {
        if (err) {
          res.json({
            success: "false",
            data: "There is a problem with the database",
          });
          return;
        }
        res.json({
          success: "true",
          data: result.length != 0 ? result : "Tickets not found",
        });
      }
    );
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

    if (!req.body.package_id) {
      res.json({
        success: "false",
        data: "package_id is required",
      });
      return false;
    }

    if (!req.body.subject) {
      res.json({
        success: "false",
        data: "subject is required",
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

    if (!req.body.periority) {
      res.json({
        success: "false",
        data: "periority is required",
      });
      return false;
    }

    const today = getToday();
    const customer_id = decode.id;

    conn.query(
      `INSERT INTO tickets(customer_id,package_id,subject,description,periority,status,created_at,updated_at)
        VALUES('${customer_id}','${req.body.package_id}','${req.body.subject}','${req.body.description}','${req.body.periority}','0','${today}','${today}')`,
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
          data: "The ticket was inserted successfully",
        });
      }
    );
  });
});

export default router;
