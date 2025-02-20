import express, { json } from "express";
import mysql from "mysql2";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import { getToday } from "../assets/functions.js";
import md5 from "md5";
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
    conn.query("SELECT * FROM students order by id desc", (err, result) => {
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

router.get("/getStudent", (req, res) => {
  if (!req.headers["authorization"]) {
    res.json({
      success: "false",
      data: "Token is required",
    });
    return false;
  }

  const token = req.headers["authorization"];
  const item = req.query.item;
  const itemValue = req.query.itemValue;
  
  jwt.verify(token.split(" ")[1], process.env.JWT_SECRET, (err, decode) => {
    if (err) {
      res.json({
        success: "false",
        data: err,
      });
      return false;
    }
    const id = decode.id;
    conn.query(`SELECT * FROM students where id=${id}`, (err, result) => {
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

router.post("/addSelf", (req, res) => {
  if (!req.body.firstName) {
    res.json({
      success: "false",
      data: "firstName is required",
    });
    return false;
  }
  if (!req.body.lastName) {
    res.json({
      success: "false",
      data: "lastName is required",
    });
    return false;
  }
  if (!req.body.mobile) {
    res.json({
      success: "false",
      data: "mobile is required",
    });
    return false;
  }
  if (!req.body.melliCode) {
    res.json({
      success: "false",
      data: "melliCode is required",
    });
    return false;
  }
  if (!req.body.password) {
    res.json({
      success: "false",
      data: "password is required",
    });
    return false;
  }

  const today = getToday();
  const hashedPassword = md5(req.body.password);

  conn.query(
    `INSERT INTO students(firstName,lastName,mobile,phone,melliCode,status,state,city,address,password,description,refer_to,created_at,updated_at)
          VALUES('${req.body.firstName}','${req.body.lastName}','${req.body.mobile}','${req.body.phone}','${req.body.melliCode}','1','${req.body.state}','${req.body.city}','${req.body.address}','${hashedPassword}','${req.body.description}','1','${today}','${today}')`,
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
        data: "The student was inserted successfully",
      });
    }
  );
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

    if (!req.body.firstName) {
      res.json({
        success: "false",
        data: "firstName is required",
      });
      return false;
    }
    if (!req.body.lastName) {
      res.json({
        success: "false",
        data: "lastName is required",
      });
      return false;
    }
    if (!req.body.mobile) {
      res.json({
        success: "false",
        data: "mobile is required",
      });
      return false;
    }
    if (!req.body.melliCode) {
      res.json({
        success: "false",
        data: "melliCode is required",
      });
      return false;
    }
    if (!req.body.password) {
      res.json({
        success: "false",
        data: "password is required",
      });
      return false;
    }

    const today = getToday();
    const hashedPassword = md5(req.body.password);
    
    conn.query(
      `INSERT INTO students(firstName,lastName,mobile,phone,melliCode,status,state,city,address,password,description,refer_to,created_at,updated_at)
            VALUES('${req.body.firstName}','${req.body.lastName}','${req.body.mobile}','${req.body.phone || null}','${req.body.melliCode}','${req.body.status}','${req.body.state || null}','${req.body.city || null}','${req.body.address || null}','${hashedPassword}','${req.body.description}','1','${today}','${today}')`,
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
          data: "The student was inserted successfully",
        });
      }
    );

  });
});

export default router;
