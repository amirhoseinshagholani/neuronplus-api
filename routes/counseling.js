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
    conn.query("SELECT counseling.*,students.firstName as firstName,students.lastName as lastName FROM counseling INNER JOIN students ON counseling.customer_id=students.id", (err, result) => {
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

router.get("/getCounseling", (req, res) => {
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
    conn.query(`SELECT * FROM counseling where id='${id}'`, (err, result) => {
      if (err) {
        res.json({
          success: "false",
          data: "There is a problem with the database",
        });
        return;
      }
      res.json({
        success: "true",
        data: result.length != 0 ? result : "Counseling not found",
      });
    });
  });
});

router.get("/getUserCounseling", (req, res) => {
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

    const customer_id = decode.id;

    conn.query(`SELECT * FROM counseling where customer_id='${customer_id}'`, (err, result) => {
      if (err) {
        res.json({
          success: "false",
          data: "There is a problem with the database",
        });
        return;
      }
      res.json({
        success: "true",
        data: result.length != 0 ? result : "Counseling not found",
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

    if (!req.body.subject) {
      res.json({
        success: "false",
        data: "subject is required",
      });
      return false;
    }
    if (!req.body.phone) {
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
      `INSERT INTO counseling(customer_id,subject,phone,description,status,created_at,updated_at)
        VALUES('${customer_id}','${req.body.subject}','${req.body.phone}','${req.body.description}','0','${today}','${today}')`,
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
          data: "The counseling was inserted successfully",
        });
      }
    );
  });
});

router.put("/acceptRequest", (req, res) => {
  if (!req.headers["authorization"]) {
    res.json({
      success: "false",
      data: "Token is required",
    });
    return false;
  }

  if (!req.body.id) {
    res.json({
      success: "false",
      data: "id is required",
    });
    return false;
  }

  const token = req.headers["authorization"];
  const id = req.body.id;
  const today = getToday();

  jwt.verify(token.split(" ")[1], process.env.JWT_SECRET, (err, decode) => {
    if (err) {
      res.json({
        success: "false",
        data: err,
      });
      return false;
    }
    conn.query(
      `UPDATE counseling SET status = ? WHERE id = ?`,
      [
        '1',
        id,
      ],
      (err, result) => {
        if (err) {
          res.json({
            success: "false",
            data: err,
          });
          return;
        }

        if (result.affectedRows) {
          res.json({
            success: "true",
            data: "The counseling was updated successfully",
          });
        } else {
          res.json({
            success: "true",
            data: "Request not found",
          });
        }
      }
    );
  });
});

router.put("/rejectRequest", (req, res) => {
  if (!req.headers["authorization"]) {
    res.json({
      success: "false",
      data: "Token is required",
    });
    return false;
  }

  if (!req.body.id) {
    res.json({
      success: "false",
      data: "id is required",
    });
    return false;
  }

  const token = req.headers["authorization"];
  const id = req.body.id;
  const today = getToday();

  jwt.verify(token.split(" ")[1], process.env.JWT_SECRET, (err, decode) => {
    if (err) {
      res.json({
        success: "false",
        data: err,
      });
      return false;
    }
    conn.query(
      `UPDATE counseling SET status = ? WHERE id = ?`,
      [
        '2',
        id,
      ],
      (err, result) => {
        if (err) {
          res.json({
            success: "false",
            data: err,
          });
          return;
        }

        if (result.affectedRows) {
          res.json({
            success: "true",
            data: "The counseling was updated successfully",
          });
        } else {
          res.json({
            success: "true",
            data: "Request not found",
          });
        }
      }
    );
  });
});

router.put("/waitingRequest", (req, res) => {
  if (!req.headers["authorization"]) {
    res.json({
      success: "false",
      data: "Token is required",
    });
    return false;
  }

  if (!req.body.id) {
    res.json({
      success: "false",
      data: "id is required",
    });
    return false;
  }

  const token = req.headers["authorization"];
  const id = req.body.id;
  const today = getToday();

  jwt.verify(token.split(" ")[1], process.env.JWT_SECRET, (err, decode) => {
    if (err) {
      res.json({
        success: "false",
        data: err,
      });
      return false;
    }
    conn.query(
      `UPDATE counseling SET status = ? WHERE id = ?`,
      [
        '0',
        id,
      ],
      (err, result) => {
        if (err) {
          res.json({
            success: "false",
            data: err,
          });
          return;
        }

        if (result.affectedRows) {
          res.json({
            success: "true",
            data: "The counseling was updated successfully",
          });
        } else {
          res.json({
            success: "true",
            data: "Request not found",
          });
        }
      }
    );
  });
});

export default router;
