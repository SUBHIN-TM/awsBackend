require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const db = require("./db");
const fs = require("fs");

const app = express();
app.use(express.json());
app.use(cors());
app.use(express.static(path.resolve(__dirname, "../awsFrontend/dist"))); //react app

// console.log("DB_USER =", process.env.DB_USER); console.log("DB_PASSWORD =", process.env.DB_PASSWORD);

// Add new record
app.post("/api/add", async (req, res) => {
  console.log("req.body", req.body);
  
  const { name, phone } = req.body;
  try {
    await db.query("INSERT INTO users (name, phone) VALUES (?, ?)", [name, phone]);
    res.json({ success: true, message: "User saved!" });
  } catch (err) {
    console.log("err",err);
    
    res.status(500).json({ success: false, error: err.message });
  }
});

// Get all records
app.get("/api/list", async (req, res) => {
  try {
    console.log("Fetching user list");
    const [rows] = await db.query("SELECT * FROM users");
    res.json(rows);
  } catch (err) {
    console.log("err", err);
    res.status(500).json({ success: false, error: err.message });
  }
});


// if (process.env.MODE === "production") {
//   const buildPath = path.join(__dirname, "../awsFrontend/dist");
//   app.use(express.static(buildPath));

//   // console.log("buildpath", buildPath);

//   fs.readdir(buildPath, (err, files) => {
//     if (err) {
//       console.error("Error reading build folder:", err);
//     } else {
//       console.log("Files inside buildPath:");
//       // files.forEach(file => console.log(" -", file));
//     }
//   });

//   app.get(/.*/, (req, res) => {
//     res.sendFile(path.join(buildPath, "index.html"));
//   });
// }

app.get(/^(?!\/api).*/, (req, res) => {
  res.sendFile(path.join(__dirname, "../awsFrontend/dist/index.html"));
});
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
