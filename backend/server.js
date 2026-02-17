const express = require("express");
const app = express();

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.get("/health", (req, res) => {
  res
    .status(200)
    .json({ success: true, messgae: "user-management-sys server is running" });
});

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(
    `user-management-sys backend is running at http://localhost:${port}`,
  );
});
