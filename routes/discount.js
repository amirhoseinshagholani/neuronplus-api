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
    conn.query("SELECT * FROM discounts", (err, result) => {
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

router.get("/getDiscount", (req, res) => {
  if (!req.headers["authorization"]) {
    res.json({
      success: "false",
      data: "Token is required",
    });
    return false;
  }

  if (!req.query.discount_code) {
    res.json({
      success: "false",
      data: "discount_code is required",
    });
    return false;
  }

  const token = req.headers["authorization"];
  const discount_code = req.query.discount_code;
  jwt.verify(token.split(" ")[1], process.env.JWT_SECRET, (err, decode) => {
    if (err) {
      res.json({
        success: "false",
        data: err,
      });
      return false;
    }
    conn.query(`SELECT * FROM discounts where discount_code='${discount_code}'`, (err, result) => {
      if (err) {
        res.json({
          success: "false",
          data: "There is a problem with the database",
        });
        return;
      }
      res.json({
        success: "true",
        data: result.length != 0 ? result : "Discount not found",
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
    if (!req.body.discount_code) {
      res.json({
        success: "false",
        data: "discount_code is required",
      });
      return false;
    }
    if (!req.body.discount) {
      res.json({
        success: "false",
        data: "discount is required",
      });
      return false;
    }

    const today = getToday();

    conn.query(
      `INSERT INTO discounts(title,status,discount_code,discount,description,refer_to,created_at,updated_at)
        VALUES('${req.body.title}','${req.body.status}','${req.body.discount_code}','${req.body.discount}','${req.body.description}','${refer_to}','${today}','${today}')`,
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
          data: "The discount was inserted successfully",
        });
      }
    );
  });
});

// router.put("/edit", (req, res) => {
//   // res.json("hi");
//   // return;
//   if (!req.headers["authorization"]) {
//     res.json({
//       success: "false",
//       data: "Token is required",
//     });
//     return false;
//   }

//   if (!req.query.id) {
//     res.json({
//       success: "false",
//       data: "id is required",
//     });
//     return false;
//   }
//   const token = req.headers["authorization"];
//   const id = req.query.id;
//   const today = getToday();

//   if (!req.body.title) {
//     res.json({
//       success: "false",
//       data: "title is required",
//     });
//     return false;
//   }
//   if (!req.body.status) {
//     res.json({
//       success: "false",
//       data: "status is required",
//     });
//     return false;
//   }
//   if (!req.body.type) {
//     res.json({
//       success: "false",
//       data: "type is required",
//     });
//     return false;
//   }

//   // res.json(req.body);
//   // return;
//   jwt.verify(token.split(" ")[1], process.env.JWT_SECRET, (err, decode) => {
//     if (err) {
//       res.json({
//         success: "false",
//         data: err,
//       });
//       return false;
//     }
//     conn.query(
//       `UPDATE roles SET title = ?, status = ?, type = ?, description = ?, updated_at = ? WHERE id = ?`,
//       [
//         req.body.title,
//         req.body.status,
//         req.body.type,
//         req.body.description,
//         today,
//         id,
//       ],
//       (err, result) => {
//         if (err) {
//           res.json({
//             success: "false",
//             data: "There is a problem with the database",
//           });
//           return;
//         }

//         if (result.affectedRows) {
//           res.json({
//             success: "true",
//             data: "The role was inserted successfully",
//           });
//         } else {
//           res.json({
//             success: "true",
//             data: "Role not found",
//           });
//         }
//       }
//     );
//   });
// });

export default router;
