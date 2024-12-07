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

router.get("/categoreis/get/all", (req, res) => {
  conn.query("SELECT * FROM categories", (err, result) => {
    if (err) {
      res.json({
        success: "false",
        data: err,
      });
      return false;
    }
    res.json({
      success: "true",
      data: result,
    });
  });
});

router.get("/category/get", (req, res) => {
  var id = req.query.id;
  if(!id){
    res.json({
      success: "false",
      data: "id is required",
    });
    return false;
  }
  conn.query(`SELECT * FROM categories WHERE id=${id}`, (err, result) => {
    if (err) {
      res.json({
        success: "false",
        data: err,
      });
      return false;
    }
    res.json({
      success: "true",
      data: result,
    });
  });
});

router.get("/courses/get", (req, res) => {
  var category_id = req.query.category_id;
  if(!category_id){
    res.json({
      success: "false",
      data: "category_id is required",
    });
    return false;
  }
  conn.query(`SELECT * FROM packagesheader WHERE cat_id=${category_id}`, (err, result) => {
    if (err) {
      res.json({
        success: "false",
        data: err,
      });
      return false;
    }
    res.json({
      success: "true",
      data: result,
    });
  });
});

router.get("/package/get", (req, res) => {
  var package_id = req.query.package_id;
  if(!package_id){
    res.json({
      success: "false",
      data: "package_id is required",
    });
    return false;
  }
  conn.query(`SELECT * FROM packagesheader WHERE id=${package_id}`, (err, result) => {
    if (err) {
      res.json({
        success: "false",
        data: err,
      });
      return false;
    }
    res.json({
      success: "true",
      data: result,
    });
  });
});

router.get("/teaching/get", (req, res) => {
  var package_id = req.query.package_id;
  if(!package_id){
    res.json({
      success: "false",
      data: "package_id is required",
    });
    return false;
  }
  conn.query(`SELECT * FROM teaching WHERE package_id=${package_id}`, (err, result) => {
    if (err) {
      res.json({
        success: "false",
        data: err,
      });
      return false;
    }
    res.json({
      success: "true",
      data: result,
    });
  });
});

router.get("/worksheets/get", (req, res) => {
  var package_id = req.query.package_id;
  if(!package_id){
    res.json({
      success: "false",
      data: "package_id is required",
    });
    return false;
  }
  conn.query(`SELECT * FROM worksheet WHERE package_id=${package_id}`, (err, result) => {
    if (err) {
      res.json({
        success: "false",
        data: err,
      });
      return false;
    }
    res.json({
      success: "true",
      data: result,
    });
  });
});

router.post("/message/send", (req, res) => {

  if (!req.body.subject) {
    res.json({
      success: "false",
      data: "subject is required",
    });
    return false;
  }
  if (!req.body.email) {
    res.json({
      success: "false",
      data: "phone is required",
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
    `INSERT INTO messages(subject,email,description,created_at,updated_at)
      VALUES('${req.body.subject}','${req.body.email}','${req.body.description}','${today}','${today}')`,
    (err, result) => {
      if (err) {
        res.status(400).json({
          success: "false",
          data: err,
        });
        return false;
      }
      res.status(200).json({
        success: "true",
        data: "The message was inserted successfully",
      });
    }
  );
});


export default router;
