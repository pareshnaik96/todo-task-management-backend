"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.markComplete = exports.deleteTask = exports.updateTask = exports.createTask = exports.getTasks = void 0;
const Task_1 = __importDefault(require("../models/Task"));
const getTasks = async (req, res) => {
    try {
        const { status, dueDate, priority, page = 1, limit = 10 } = req.query;
        const role = req.user.role;
        const userId = req.user.id;
        let filter = {};
        // Role-based access control
        if (role === "User") {
            filter.assignedTo = userId;
        }
        else if (role === "Manager") {
            filter.createdBy = userId;
        }
        // Apply filters
        if (status)
            filter.status = status;
        if (priority)
            filter.priority = priority;
        if (dueDate)
            filter.dueDate = { $lte: new Date(dueDate) };
        // Pagination
        const skip = (Number(page) - 1) * Number(limit);
        const tasks = await Task_1.default.find(filter)
            .populate("assignedTo", "name email role") // populate with selected fields
            .skip(skip)
            .limit(Number(limit));
        const total = await Task_1.default.countDocuments(filter);
        res.json({
            tasks,
            page: Number(page),
            totalPages: Math.ceil(total / Number(limit)),
            totalTasks: total,
        });
    }
    catch (err) {
        res.status(500).json({ message: "Failed to fetch tasks" });
    }
};
exports.getTasks = getTasks;
// Create Task
const createTask = async (req, res) => {
    try {
        const task = await Task_1.default.create({ ...req.body, createdBy: req.user._id });
        res.status(201).json(task);
    }
    catch (error) {
        res.status(500).json({ message: "Failed to create task" });
    }
};
exports.createTask = createTask;
// Update Task
const updateTask = async (req, res) => {
    try {
        const task = await Task_1.default.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
        });
        if (!task) {
            res.status(404).json({ message: "Task not found" });
        }
        res.json(task);
    }
    catch (error) {
        res.status(500).json({ message: "Failed to update task" });
    }
};
exports.updateTask = updateTask;
// Delete Task
const deleteTask = async (req, res) => {
    try {
        const task = await Task_1.default.findByIdAndDelete(req.params.id);
        if (!task) {
            res.status(404).json({ message: "Task not found" });
        }
        res.status(200).json({ message: "Task successfully deleted" });
    }
    catch (error) {
        res.status(500).json({ message: "Failed to delete task" });
    }
};
exports.deleteTask = deleteTask;
// Mark Task as Complete
const markComplete = async (req, res) => {
    try {
        const task = await Task_1.default.findByIdAndUpdate(req.params.id, { status: "completed" }, { new: true });
        if (!task) {
            res.status(404).json({ message: "Task not found" });
        }
        res.status(200).json({ message: "Task marked as completed successfully", task });
    }
    catch (error) {
        res.status(500).json({ message: "Failed to mark task as complete" });
    }
};
exports.markComplete = markComplete;
