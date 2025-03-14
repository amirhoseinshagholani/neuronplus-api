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

router.get("/get/workSheet", (req, res) => {
  if (!req.headers["authorization"]) {
    res.json({
      success: "false",
      data: "Token is required",
    });
    return false;
  }

  const package_id = req.query.package_id;

  if (!package_id) {
    res.status(400).json({
      success: "false",
      data: "package_id is required",
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

    conn.query(
      `
        SELECT workSheet.*, packagesheader.title AS course_title 
        FROM workSheet
        INNER JOIN packagesheader ON workSheet.package_id = packagesheader.id where package_id = ${package_id}
      `,
      (err, result) => {
        if (err) {
          res.json({
            success: "false",
            data: "There is a problem with the database",
          });
          return;
        }

          res.status(200).json({
            success: "true",
            data: result,
          });
        
      }
    );
  });
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

    conn.query(
      `
        SELECT workSheet.*, packagesheader.title AS course_title 
        FROM workSheet
        INNER JOIN packagesheader ON workSheet.package_id = packagesheader.id
      `,
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
          data: result,
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

    const refer_to = decode.id;

    if (!req.body.package_id) {
      res.status(400).json({
        success: "false",
        data: "course is required",
      });
      return false;
    }
    if (!req.body.title) {
      res.status(400).json({
        success: "false",
        data: "title is required",
      });
      return false;
    }
    if (!req.body.cover) {
      res.status(400).json({
        success: "false",
        data: "cover is required",
      });
      return false;
    }
    if (!req.body.workSheet_file) {
      res.status(400).json({
        success: "false",
        data: "workSheet_file is required",
      });
      return false;
    }
    if (!req.body.video_file) {
        res.status(400).json({
          success: "false",
          data: "video_file is required",
        });
        return false;
      }

    const today = getToday();

    conn.query(
      `INSERT INTO workSheet(package_id,status,free,title,cover,workSheet_file,video_file,lengthVideoFile,sizeVideoFile,refer_to,description,created_at,updated_at)
            VALUES('${req.body.package_id}','${req.body.status}','${req.body.free}','${req.body.title}','${req.body.cover}','${req.body.workSheet_file}','${req.body.video_file}','${req.body.lengthVideoFile}','${req.body.sizeVideoFile}','${refer_to}','${req.body.description}','${today}','${today}')`,
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
          data: "The workSheet was inserted successfully",
        });
      }
    );
  });
});

export default router;
