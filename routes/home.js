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

export default router;
