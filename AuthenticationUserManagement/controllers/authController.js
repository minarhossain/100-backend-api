import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

import {
  loginValidator,
  registerValidator,
} from "../validation/authValidator.js";
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

// login handler
export const loginUser = async (req, res) => {
  try {
    // Validate request
    const { error } = loginValidator(req.body);
    if (error)
      return res.status(400).json({ message: error.details[0].message });

    const { email, password } = req.body;

    // check user is exists
    const user = await User.findOne({ email });
    if (!user)
      return res.status(400).json({ message: "Invalid Email or Password" });

    // Validate Password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid User or Password" });

    // Generate JWT Token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    res.status(200).json({
      message: "Login successful",
      token,
      user: { id: user._id, email },
    });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// update profile
export const updateProfile = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // find user by id (From JWT Token)
    const user = await User.findById(req.user.id);
    if (!user) return res.status(400).json({ message: "User not found" });

    // update field if provided
    if (name) user.name = name;
    if (email) user.email = email;

    // if password is provided hash it
    if (password) {
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);
    }

    await user.save();

    res.status(200).json({
      message: "Profile Update Successfully",
      user: { id: user_id, name: user.name, email: user.email },
    });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};
