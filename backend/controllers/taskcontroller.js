const mongoose = require("mongoose");
const Task = require("../models/task");
const Project = require("../models/project");

// Validate that a project belongs to the logged-in user.
const validateProject = async (projectId, userId) => {
  if (!projectId) return null;

  if (!mongoose.Types.ObjectId.isValid(projectId)) {
    throw new Error("Invalid project ID");
  }

  const project = await Project.findOne({
    _id: projectId,
    user: userId,
  });

  if (!project) {
    throw new Error("Project not found or access denied");
  }

  return project._id;
};

// CREATE TASK
const createTask = async (req, res) => {
  try {
    const {
      title,
      description = "",
      status = "pending",
      priority = "medium",
      dueDate,
      project,
    } = req.body;

    if (typeof title !== "string" || !title.trim()) {
      return res.status(400).json({
        message: "Task title is required",
      });
    }

    let projectId = null;

    if (project) {
      projectId = await validateProject(project, req.user.userId);
    }

    const task = await Task.create({
      title: title.trim(),
      description,
      status,
      priority,
      ...(dueDate ? { dueDate } : {}),
      project: projectId,
      user: req.user.userId,
    });

    return res.status(201).json({
      message: "Task created successfully",
      task,
    });
  } catch (error) {
    console.error("Create Task Error:", error);

    return res.status(400).json({
      message: error.message || "Failed to create task",
    });
  }
};

// GET ALL TASKS
const getTasks = async (req, res) => {
  try {
    // TEMPORARY DIAGNOSTIC LOGS
    console.log("JWT user ID:", req.user?.userId);
    console.log("JWT payload:", {
      userId: req.user?.userId,
      email: req.user?.email,
    });
    console.log("MongoDB database:", Task.db.name);

    // TEMPORARY TEST: Fetch all tasks to diagnose the user filter.
    const tasks = await Task.find({})
      .populate("project", "name status")
      .sort({ createdAt: -1 });

    console.log("Tasks found without user filter:", tasks.length);
    console.log(
      "Task titles:",
      tasks.map((task) => task.title)
    );

    return res.status(200).json({ tasks });
  } catch (error) {
    console.error("Get Tasks Error:", error);

    return res.status(500).json({
      message: "Failed to get tasks",
    });
  }
};

// GET SINGLE TASK
const getTaskById = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({
        message: "Invalid task ID",
      });
    }

    const task = await Task.findOne({
      _id: req.params.id,
      user: req.user.userId,
    }).populate("project", "name status");

    if (!task) {
      return res.status(404).json({
        message: "Task not found",
      });
    }

    return res.status(200).json({ task });
  } catch (error) {
    console.error("Get Task Error:", error);

    return res.status(500).json({
      message: "Failed to get task",
    });
  }
};

// UPDATE TASK
const updateTask = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({
        message: "Invalid task ID",
      });
    }

    const task = await Task.findOne({
      _id: req.params.id,
      user: req.user.userId,
    });

    if (!task) {
      return res.status(404).json({
        message: "Task not found",
      });
    }

    const allowedFields = [
      "title",
      "description",
      "status",
      "priority",
      "dueDate",
    ];

    for (const field of allowedFields) {
      if (req.body[field] !== undefined) {
        task[field] =
          field === "title" && typeof req.body[field] === "string"
            ? req.body[field].trim()
            : req.body[field];
      }
    }

    if (req.body.title !== undefined && !task.title) {
      return res.status(400).json({
        message: "Task title cannot be empty",
      });
    }

    if (req.body.project !== undefined) {
      task.project = req.body.project
        ? await validateProject(req.body.project, req.user.userId)
        : null;
    }

    await task.save();

    const updatedTask = await Task.findById(task._id)
      .populate("project", "name status");

    return res.status(200).json({
      message: "Task updated successfully",
      task: updatedTask,
    });
  } catch (error) {
    console.error("Update Task Error:", error);

    return res.status(400).json({
      message: error.message || "Failed to update task",
    });
  }
};

// DELETE TASK
const deleteTask = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({
        message: "Invalid task ID",
      });
    }

    const task = await Task.findOneAndDelete({
      _id: req.params.id,
      user: req.user.userId,
    });

    if (!task) {
      return res.status(404).json({
        message: "Task not found",
      });
    }

    return res.status(200).json({
      message: "Task deleted successfully",
    });
  } catch (error) {
    console.error("Delete Task Error:", error);

    return res.status(500).json({
      message: "Failed to delete task",
    });
  }
};

module.exports = {
  createTask,
  getTasks,
  getTaskById,
  updateTask,
  deleteTask,
};