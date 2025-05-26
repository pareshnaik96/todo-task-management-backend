"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.login = exports.register = void 0;
const User_1 = __importDefault(require("../models/User"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
// Register 
const register = async (req, res) => {
    if (!req.body.email) {
        res.status(400).json({ message: 'Email required' });
    }
    try {
        const user = await User_1.default.create(req.body);
        res.status(201).json({ message: 'registered', user });
    }
    catch (err) {
        console.error("Error during registration:", err);
        res.status(500).json({ message: 'Registration failed', error: err });
    }
};
exports.register = register;
// Login
const login = async (req, res) => {
    const { email, password } = req.body;
    const user = await User_1.default.findOne({ email });
    if (!user || !(await user.comparePassword(password))) {
        res.status(400).json({ message: "Invalid credentials" });
        return;
    }
    const token = jsonwebtoken_1.default.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
        expiresIn: "1d",
    });
    res.status(200).json({ message: "logged in", token });
    return;
};
exports.login = login;
