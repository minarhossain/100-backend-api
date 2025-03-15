import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

import { registerValidator } from "../validation/authValidator.js";
import { User } from "../models/userModels.js";
dotenv.config();

export const registerUser = async (req, res) => {
  try {
    // Validate request
    const { error } = registerValidator(req.body);
    if (error)
      return res.status(400).json({ message: error.details[0].message });
    const { name, email, password } = req.body;

    // check if user already exits
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email Already Exists" });
    }

    // Hash Password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // create user
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
    });

    await newUser.save();

    // Generate JSON Web Token
    const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    res.status(201).json({
      message: "User Registration Successfully.",
      token,
      user: { id: newUser._id, name, email },
    });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};
