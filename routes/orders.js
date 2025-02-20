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
    conn.query("SELECT * FROM orders", (err, result) => {
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

router.get("/getOrder", (req, res) => {
  if (!req.headers["authorization"]) {
    res.json({
      success: "false",
      data: "Token is required",
    });
    return false;
  }

  if (!req.query.id) {
    res.json({
      success: "false",
      data: "id is required",
    });
    return false;
  }

  const token = req.headers["authorization"];
  const id = req.query.id;
  jwt.verify(token.split(" ")[1], process.env.JWT_SECRET, (err, decode) => {
    if (err) {
      res.json({
        success: "false",
        data: err,
      });
      return false;
    }
    conn.query(`SELECT * FROM orders where id='${id}'`, (err, result) => {
      if (err) {
        res.json({
          success: "false",
          data: "There is a problem with the database",
        });
        return;
      }
      res.json({
        success: "true",
        data:  result,
      });
    });
  });
});

router.get("/getMyOrders", (req, res) => {
  if (!req.headers["authorization"]) {
    res.status(400).json({
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
        data: err,
      });
      return false;
    }
    const customer_id = decode.id;
    conn.query(`SELECT * FROM orders where customer_id='${customer_id}'`, (err, result) => {
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

router.get("/checkRegister", (req, res) => {
  if (!req.headers["authorization"]) {
    res.json({
      success: "false",
      data: "Token is required",
    });
    return false;
  }

  if (!req.query.package_id) {
    res.json({
      success: "false",
      data: "package_id is required",
    });
    return false;
  }

  if (!req.query.student_id) {
    res.json({
      success: "false",
      data: "student_id is required",
    });
    return false;
  }

  const token = req.headers["authorization"];
  const package_id = req.query.package_id;
  const student_id = req.query.student_id;

  jwt.verify(token.split(" ")[1], process.env.JWT_SECRET, (err, decode) => {
    if (err) {
      res.json({
        success: "false",
        data: err,
      });
      return false;
    }
    conn.query(`SELECT * FROM orders where customer_id='${student_id}' AND package_id='${package_id}'`, (err, result) => {
      if (err) {
        res.status(400).json({
          success: "false",
          data: "There is a problem with the database",
        });
        return;
      }
      res.status(200).json({
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

    const customer_id = decode.id;
    const tracking_code = "0000000000";
    const status = "1";


    if (!req.body.package_id) {
      res.status(400).json({
        success: "false",
        data: "package_id is required",
      });
      return false;
    }

    if (!req.body.price) {
      res.status(400).json({
        success: "false",
        data: "price is required",
      });
      return false;
    }

    if (!req.body.finally_price) {
      res.status(400).json({
        success: "false",
        data: "finally_price is required",
      });
      return false;
    }

    const today = getToday();

    conn.query(
      `INSERT INTO orders(tracking_code,customer_id,package_id,discount_id,status,price,finally_price,description,created_at,updated_at)
        VALUES('${tracking_code}','${customer_id}','${req.body.package_id}','${req.body.discount_id}','${status}','${req.body.price}','${req.body.finally_price}','${req.body.description}','${today}','${today}')`,
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
          data: "The order was inserted successfully",
        });
      }
    );
  });
});


export default router;
