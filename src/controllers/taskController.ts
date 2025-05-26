import Task from "../models/Task";
import { Request, Response } from "express";

export const getTasks = async (req: any, res: Response) => {
  try {
    const { status, dueDate, priority, page = 1, limit = 10 } = req.query;
    const role = req.user.role;
    const userId = req.user.id;

    let filter: any = {};

    // Role-based access control
    if (role === "User") {
      filter.assignedTo = userId;
    } else if (role === "Manager") {
      filter.createdBy = userId;
    }

    // Apply filters
    if (status) filter.status = status;
    if (priority) filter.priority = priority;
    if (dueDate) filter.dueDate = { $lte: new Date(dueDate as string) };

    // Pagination
    const skip = (Number(page) - 1) * Number(limit);

    const tasks = await Task.find(filter)
      .populate("assignedTo", "name email role") // populate with selected fields
      .skip(skip)
      .limit(Number(limit));

    const total = await Task.countDocuments(filter);

    res.json({
      tasks,
      page: Number(page),
      totalPages: Math.ceil(total / Number(limit)),
      totalTasks: total,
    });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch tasks" });
  }
};

// Create Task
export const createTask = async (req: any, res: Response) => {
  try {
    const task = await Task.create({ ...req.body, createdBy: req.user._id });
    res.status(201).json(task);
  } catch (error) {
    res.status(500).json({ message: "Failed to create task" });
  }
};

// Update Task
export const updateTask = async (req: Request, res: Response) => {
  try {
    const task = await Task.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });

    if (!task) {
      res.status(404).json({ message: "Task not found" }); 
    }

    res.json(task);
  } catch (error) {
    res.status(500).json({ message: "Failed to update task" });
  }
};


// Delete Task
export const deleteTask = async (req: Request, res: Response) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);
    if (!task) {
      res.status(404).json({ message: "Task not found" });
    }
    res.status(200).json({ message: "Task successfully deleted" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete task" });
  }
};

// Mark Task as Complete
export const markComplete = async (req: Request, res: Response) => {
  try {
    const task = await Task.findByIdAndUpdate(
      req.params.id,
      { status: "completed" },
      { new: true }
    );
    if (!task) {
      res.status(404).json({ message: "Task not found" });
    }
    res.status(200).json({ message: "Task marked as completed successfully", task });
  } catch (error) {
    res.status(500).json({ message: "Failed to mark task as complete" });
  }
};
