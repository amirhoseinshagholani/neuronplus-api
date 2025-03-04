import express, { json } from "express";
import mysql from "mysql2";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import { getToday } from "../assets/functions.js";
dotenv.config();

const router = express.Router();

const conn = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,  
  connectionLimit: 100,   // تا ۱۰۰ اتصال همزمان
  queueLimit: 500         // تا ۵۰۰ درخواست در صف بمانند
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
    conn.query(`SELECT * FROM orders where customer_id='${customer_id}' AND status=1`, (err, result) => {
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
    conn.query(`SELECT * FROM orders where customer_id='${student_id}' AND package_id='${package_id}' AND status=1`, (err, result) => {
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
    const tracking_code = Math.floor(Math.pow(10, 14) + Math.random() * 9 * Math.pow(10, 14));
    const status = "2";


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
          tracking_code:tracking_code,
          data: "The order was inserted successfully",
        });
      }
    );
  });
});

router.post("/updateStatus", (req, res) => {
  if (!req.headers["authorization"]) {
    return res.status(400).json({ success: false, data: "Token is required" });
  }

  const token = req.headers["authorization"].split(" ")[1];

  jwt.verify(token, process.env.JWT_SECRET, (err, decode) => {
    if (err) {
      return res.status(400).json({ success: false, data: "The token is incorrect" });
    }

    if (!req.body.authority) {
      return res.status(400).json({ success: false, data: "authority is required" });
    }

    if (!req.body.statusValue) {
      return res.status(400).json({ success: false, data: "status is required" });
    }

    conn.query("UPDATE orders SET status = ? WHERE authority = ?", 
      [req.body.statusValue, req.body.authority], 
      (err, result) => {
        if (err) {
          console.error("❌ خطا در بروزرسانی:", err);
          return res.status(500).json({ success: false, data: err });
        }

        if (result.affectedRows > 0) {
          // 🔹 بعد از بروزرسانی، `tracking_code` را دریافت کن
          conn.query("SELECT * FROM orders WHERE authority = ?", 
            [req.body.authority], 
            (err, rows) => {
              if (err) {
                console.error("❌ خطا در دریافت tracking_code:", err);
                return res.status(500).json({ success: false, data: err });
              }

              if (rows.length > 0) {
                return res.json({
                  success: true,
                  message: "Status updated successfully",
                  tracking_code: rows[0].tracking_code,
                  package_id: rows[0].package_id
                });
              } else {
                return res.status(404).json({ success: false, data: "No record found" });
              }
          });

        } else {
          return res.status(404).json({ success: false, data: "No record found" });
        }
    });
  });
});




export default router;
