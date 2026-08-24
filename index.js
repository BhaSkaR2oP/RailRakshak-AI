const express = require("express");
const cors = require("cors");
const { Pool } = require("pg");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

// PostgreSQL connection
const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
});

// Test database connection
pool
  .connect()
  .then((client) => {
    console.log("PostgreSQL connected successfully!");
    client.release();
  })
  .catch((err) => {
    console.error("PostgreSQL connection failed:", err.message);
  });

// Home route
app.get("/", (req, res) => {
  res.json({
    message: "RailRakshak AI Backend is running!",
  });
});

// Database test route
app.get("/api/db-test", async (req, res) => {
  try {
    const result = await pool.query("SELECT NOW()");

    res.json({
      success: true,
      message: "Database is connected!",
      time: result.rows[0].now,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Database connection failed",
      error: error.message,
    });
  }
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
