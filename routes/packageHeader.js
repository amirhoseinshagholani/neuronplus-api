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

    conn.query(
      `
      SELECT packagesheader.*, categories.title AS category_title 
      FROM packagesheader
      INNER JOIN categories ON packagesheader.cat_id = categories.id
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

router.get("/getPackage", (req, res) => {
  if (!req.headers["authorization"]) {
    res.json({
      success: "false",
      data: "Token is required",
    });
    return false;
  }

  const package_id = req.query.package_id;

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
      SELECT packagesheader.*, categories.title AS category_title 
      FROM packagesheader
      INNER JOIN categories ON packagesheader.cat_id = categories.id WHERE packagesheader.id=${package_id}
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

    if (!req.body.cat_id) {
      res.json({
        success: "false",
        data: "category is required",
      });
      return false;
    }
    if (!req.body.title) {
      res.json({
        success: "false",
        data: "title is required",
      });
      return false;
    }
    // if (!req.body.slug) {
    //   res.json({
    //     success: "false",
    //     data: "slug is required",
    //   });
    //   return false;
    // }
    if (!req.body.price) {
      res.json({
        success: "false",
        data: "price is required",
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
    if (!req.body.description) {
      res.json({
        success: "false",
        data: "description is required",
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
    if (!req.body.teacher) {
      res.json({
        success: "false",
        data: "teacher is required",
      });
      return false;
    }
    
    var discount_price;
    if (!req.body.discount_price) {
        discount_price=0;
    }
    else
    {
        discount_price=req.body.discount_price;
    }


    const today = getToday();

    conn.query(
      `INSERT INTO packagesheader(cat_id,title,price,discount_price,cover,video,description,status,refer_to,created_at,updated_at,comment,teacher)
          VALUES('${req.body.cat_id}','${req.body.title}','${req.body.price}','${discount_price}','${req.body.cover}','${req.body.video}','${req.body.description}','${req.body.status}','${refer_to}','${today}','${today}','${req.body.comment}','${req.body.teacher}')`,
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
          data: "The packageHeader was inserted successfully",
        });
      }
    );
  });
});

export default router;
