import express from "express";
import mysql from "mysql2";
import axios from "axios";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import { getToday } from "../assets/functions.js";

dotenv.config();

const router = express.Router();

// اتصال به دیتابیس با استفاده از createPool (بهتر از createConnection)
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,  
  connectionLimit: 100,   // تا ۱۰۰ اتصال همزمان
  queueLimit: 500         // تا ۵۰۰ درخواست در صف بمانند
});


// ✅ توابع کمکی برای مدیریت توکن
const verifyToken = (token) => {
  return new Promise((resolve, reject) => {
    jwt.verify(token, process.env.JWT_SECRET, (err, decode) => {
      if (err) reject(err);
      else resolve(decode);
    });
  });
};

// ✅ درخواست پرداخت از زرین‌پال
const requestPayment = async (price) => {
  const IRR_price = price * 10;
  try {
    const response = await axios.post(
      "https://payment.zarinpal.com/pg/v4/payment/request.json",
      {
        merchant_id: "d29bf2e3-d18a-4a3a-bbf4-c1ef7c218c16", // شناسه پذیرنده
        amount: IRR_price, // مبلغ به ریال
        callback_url: "http://localhost:3000/verifyPayment", // آدرس بازگشت
        description: "Transaction description.", // توضیحات تراکنش
        metadata: {
          mobile: "09370965131",
          email: "sh.amirhosein@gmail.com",
        },
      },
      {
        headers: {
          accept: "application/json",
          "content-type": "application/json",
        },
      }
    );

    if (response.data.data && response.data.data.code === 100) {
      return {
        success: true,
        payment_url: `https://www.zarinpal.com/pg/StartPay/${response.data.data.authority}`,
        authority: response.data.data.authority,
      };
    } else {
      return {
        success: false,
        error: response.data.errors,
      };
    }
  } catch (error) {
    return {
      success: false,
      error: error.response ? error.response.data : error.message,
    };
  }
};

// ✅ مسیر پرداخت
router.post("/pay", async (req, res) => {
  try {
    // 🛑 اعتبارسنجی ورودی‌ها
    if (!req.headers["authorization"]) {
      return res.status(400).json({ success: false, data: "Token is required" });
    }

    if (!req.body.finally_price) {
      return res.status(400).json({ success: false, data: "price is required" });
    }

    if (!req.body.tracking_code) {
      return res.status(400).json({ success: false, data: "tracking_code is required" });
    }

    const token = req.headers["authorization"].split(" ")[1];
    const price = req.body.finally_price;
    const tracking_code = req.body.tracking_code;

    // ✅ دریافت اطلاعات کاربر از توکن
    const decode = await verifyToken(token);
    const customer_id = decode.id;
    const today = getToday();

    // ✅ درخواست به زرین‌پال
    const paymentResult = await requestPayment(price);

    if (!paymentResult.success) {
      return res.status(500).json({ success: false, error: paymentResult.error });
    }

    // مقدار `authority` را از `paymentResult` دریافت کن
    const authority = paymentResult.authority;

    // ✅ بروزرسانی مقدار authority در دیتابیس
    pool.query("UPDATE orders SET authority = ? WHERE tracking_code = ?", 
      [authority, tracking_code], 
      (err, result) => {
        if (err) {
          console.error("❌ خطا در بروزرسانی:", err);
          return res.status(500).json({ success: false, data: err });
        }

        if (result.affectedRows > 0) {
          console.log("✅ بروزرسانی انجام شد.");
        } else {
          console.log("⚠️ هیچ رکوردی با این tracking_code پیدا نشد.");
        }

        // ✅ بعد از آپدیت، پاسخ ارسال شود
        return res.json({
          success: true,
          customer_id: customer_id,
          data: today,
          payment_url: paymentResult.payment_url,
          authority: authority,
        });
    });

  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
});

export default router;
