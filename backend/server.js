const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const path = require("path");
const connectDB = require("./config/db");
const errorHandler = require("./middleware/errorMiddleware");
dotenv.config();

connectDB();

const app = express();

// Body data in json
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cors());

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Create uploads directory if it doesn't exist
const fs = require("fs");
const uploadDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/employees", require("./routes/employeeRoutes"));
app.use("/api/departments", require("./routes/departmentRoutes"));
app.use("/api/leaves", require("./routes/leaveRoutes"));
app.use("/api/salary", require("./routes/salaryRoutes"));
app.use("/api/dashboard", require("./routes/dashboardRoutes"));

app.get("/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "user-menegement-sys Server is running",
  });
});

app.use(errorHandler);

const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
  console.log(`user-menegement-sys server is running at http://localhost:${PORT}`);
});

// Handle unhandled promise rejections
process.on("unhandledRejection", (err, promise) => {
  console.log(`Error: ${err.message}`);
  server.close(() => process.exit(1));
});
