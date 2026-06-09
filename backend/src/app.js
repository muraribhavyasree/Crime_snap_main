const express = require("express");
const cors = require("cors");

const app = express();

/* ================= MIDDLEWARE ================= */
app.use(cors({
  origin: [
    "https://crimesnap7.netlify.app",
    "https://crimesnap26.netlify.app",
  ],
  credentials: true
}));

app.use(express.json());

/* ================= TEST ROUTE ================= */
app.get("/", (req, res) => {
  res.send("Backend API Running 🚀");
});

/* ================= ROUTES ================= */
app.use("/api/auth", require("./routes/auth.route"));
app.use("/api/admin", require("./routes/admin.route"));
app.use("/api/complaints", require("./routes/complaint.route"));
app.use("/api/locations", require("./routes/adminLocation"));

/* ================= 404 ================= */
app.use((req, res) => {
  res.status(404).json({ msg: "Route not found" });
});

module.exports = app;