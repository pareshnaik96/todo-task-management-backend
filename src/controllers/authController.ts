import { Request, Response } from "express";
import User from "../models/User";
import jwt from "jsonwebtoken";

// Register 
export const register = async (req: Request, res: Response) => {
  if (!req.body.email) {
    res.status(400).json({ message: 'Email required' });
  }
   try {
    const user = await User.create(req.body);
    res.status(201).json({ message: 'registered', user });
  } catch (err) {
    console.error("Error during registration:", err);
    res.status(500).json({ message: 'Registration failed', error: err });
  }
};

// Login
export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user || !(await user.comparePassword(password))) {
    res.status(400).json({ message: "Invalid credentials" });
    return
  }

  const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET!, {
    expiresIn: "1d",
  });

  const data = {
    token,
    _id: user._id,
    email: user.email,
    role: user.role
  }

  res.status(200).json({ message: "logged in", data });
  return
};


