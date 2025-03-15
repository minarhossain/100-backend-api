import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import router from "./routes/authRoutes.js";

// load environment variable
dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", router);

// Server Listen
app.listen(port, () => {
  console.log(`Server running http://localhost:${port}`);
  // database will be connected here
});

// User Registration (SignUp)
// Password Hashing with bcryptjs
// JSON Web Token (JWT) for authentication
// Express Validator for input field
// MVC structure
