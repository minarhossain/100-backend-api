import express from "express";
import dotenv from "dotenv";

// load environment variable
dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

app.get("/api/home", (req, res) => {
  res.send("Hello Word");
});

app.listen(port, () => {
  console.log(`Server running http://localhost:${port}`);
});
