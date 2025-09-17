// src/controllers/authController.js

import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

// A small utility function for better error handling
const sendError = (res, message, status = 400) => {
  res.status(status).json({ error: message });
};

export async function register(req, res) {
  const { name, username, password } = req.body;

  // Validate required fields
  if (!name || !username || !password) {
    return sendError(res, "Name, username, and password are required.");
  }

  // Check if username already exists
  try {
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return sendError(res, "Username already exists.", 409);
    }

    // Hash the password securely
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user with all details
    const newUser = await User.create({
      name,
      username,
      password: hashedPassword,
    });

    // Create a token for immediate login after registration
    const token = jwt.sign(
      { id: newUser._id, username: newUser.username, name: newUser.name },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.status(201).json({
      message: "Registration successful. You are now logged in.",
      token,
    });
  } catch (error) {
    console.error("Registration error:", error);
    sendError(res, "Server error during registration.", 500);
  }
}

export async function login(req, res) {
  const { username, password } = req.body;

  // Validate required fields
  if (!username || !password) {
    return sendError(res, "Username & password required.");
  }

  try {
    const user = await User.findOne({ username });
    if (!user) {
      return sendError(res, "Invalid credentials.", 401);
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return sendError(res, "Invalid credentials.", 401);
    }

    // Create a JWT with user id, username, and name
    const token = jwt.sign(
      { id: user._id, username: user.username, name: user.name },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.status(200).json({
      message: "Login successful.",
      token,
    });
  } catch (error) {
    console.error("Login error:", error);
    sendError(res, "Server error during login.", 500);
  }
}
