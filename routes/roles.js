import express, { json } from "express";
import mysql from "mysql2";
import config from "config";
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
    conn.query("SELECT * FROM roles", (err, result) => {
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

router.get("/getRole", (req, res) => {
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
    conn.query(`SELECT * FROM roles where id='${id}'`, (err, result) => {
      if (err) {
        res.json({
          success: "false",
          data: "There is a problem with the database",
        });
        return;
      }
      res.json({
        success: "true",
        data: result.length != 0 ? result : "Role not found",
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
    
    const refer_to = decode.id;

    if (!req.body.title) {
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
    if (!req.body.type) {
      res.json({
        success: "false",
        data: "type is required",
      });
      return false;
    }

    const today = getToday();

    conn.query(
      `INSERT INTO roles(title,status,type,description,refer_to,created_at,updated_at)
        VALUES('${req.body.title}','${req.body.status}','${req.body.type}','${req.body.description}','${refer_to}','${today}','${today}')`,
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
          data: "The role was inserted successfully",
        });
      }
    );
  });
});

router.put("/edit", (req, res) => {
  // res.json("hi");
  // return;
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
  const today = getToday();

  if (!req.body.title) {
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
  if (!req.body.type) {
    res.json({
      success: "false",
      data: "type is required",
    });
    return false;
  }

  // res.json(req.body);
  // return;
  jwt.verify(token.split(" ")[1], process.env.JWT_SECRET, (err, decode) => {
    if (err) {
      res.json({
        success: "false",
        data: err,
      });
      return false;
    }
    conn.query(
      `UPDATE roles SET title = ?, status = ?, type = ?, description = ?, updated_at = ? WHERE id = ?`,
      [
        req.body.title,
        req.body.status,
        req.body.type,
        req.body.description,
        today,
        id,
      ],
      (err, result) => {
        if (err) {
          res.json({
            success: "false",
            data: "There is a problem with the database",
          });
          return;
        }

        if (result.affectedRows) {
          res.json({
            success: "true",
            data: "The role was inserted successfully",
          });
        } else {
          res.json({
            success: "true",
            data: "Role not found",
          });
        }
      }
    );
  });
});

export default router;
