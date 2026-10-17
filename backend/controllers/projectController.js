const mongoose = require("mongoose");
const Project = require("../models/project");
const Task = require("../models/task");

// Get the logged-in user's ID
const getUserId = (req) => req.user.userId;

// Find a project belonging to the logged-in user
const findUserProject = async (projectId, userId) => {
  if (!mongoose.Types.ObjectId.isValid(projectId)) {
    return null;
  }

  return Project.findOne({
    _id: projectId,
    user: userId,
  });
};

// Calculate real task statistics for a project
const getProjectWithStats = async (project) => {
  const tasks = await Task.find({
    project: project._id,
    user: project.user,
  }).sort({ createdAt: -1 });

  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(
    (task) => task.status === "completed"
  ).length;

  const inProgressTasks = tasks.filter(
    (task) => task.status === "in-progress"
  ).length;

  const pendingTasks = tasks.filter(
    (task) => task.status === "pending"
  ).length;

  const progress =
    totalTasks === 0
      ? 0
      : Math.round((completedTasks / totalTasks) * 100);

  return {
    ...project.toObject(),
    tasks: totalTasks,
    completedTasks,
    inProgressTasks,
    pendingTasks,
    progress,
    taskList: tasks,
  };
};

// CREATE PROJECT
const createProject = async (req, res) => {
  try {
    const {
      name,
      description = "",
      status = "planning",
      priority = "medium",
      startDate,
      dueDate,
    } = req.body;

    if (typeof name !== "string" || !name.trim()) {
      return res.status(400).json({
        message: "Project name is required",
      });
    }

    const project = await Project.create({
      name: name.trim(),
      description,
      status,
      priority,
      ...(startDate ? { startDate } : {}),
      ...(dueDate ? { dueDate } : {}),
      user: getUserId(req),
    });

    return res.status(201).json({
      message: "Project created successfully",
      project: await getProjectWithStats(project),
    });
  } catch (error) {
    console.error("Create Project Error:", error);

    return res.status(500).json({
      message: "Failed to create project",
      error: error.message,
    });
  }
};

// GET ALL PROJECTS WITH REAL TASK STATISTICS
const getProjects = async (req, res) => {
  try {
    const projects = await Project.find({
      user: getUserId(req),
    }).sort({ createdAt: -1 });

    const projectsWithStats = await Promise.all(
      projects.map((project) => getProjectWithStats(project))
    );

    return res.status(200).json({
      projects: projectsWithStats,
    });
  } catch (error) {
    console.error("Get Projects Error:", error);

    return res.status(500).json({
      message: "Failed to fetch projects",
      error: error.message,
    });
  }
};

// GET ONE PROJECT WITH ITS REAL TASKS
const getProjectById = async (req, res) => {
  try {
    const project = await findUserProject(
      req.params.id,
      getUserId(req)
    );

    if (!project) {
      return res.status(404).json({
        message: "Project not found",
      });
    }

    return res.status(200).json({
      project: await getProjectWithStats(project),
    });
  } catch (error) {
    console.error("Get Project Error:", error);

    return res.status(500).json({
      message: "Failed to fetch project",
      error: error.message,
    });
  }
};

// UPDATE PROJECT
const updateProject = async (req, res) => {
  try {
    const project = await findUserProject(
      req.params.id,
      getUserId(req)
    );

    if (!project) {
      return res.status(404).json({
        message: "Project not found",
      });
    }

    const allowedFields = [
      "name",
      "description",
      "status",
      "priority",
      "startDate",
      "dueDate",
    ];

    for (const field of allowedFields) {
      if (req.body[field] !== undefined) {
        if (
          field === "name" &&
          (typeof req.body.name !== "string" ||
            !req.body.name.trim())
        ) {
          return res.status(400).json({
            message: "Project name cannot be empty",
          });
        }

        project[field] =
          field === "name"
            ? req.body[field].trim()
            : req.body[field];
      }
    }

    await project.save();

    return res.status(200).json({
      message: "Project updated successfully",
      project: await getProjectWithStats(project),
    });
  } catch (error) {
    console.error("Update Project Error:", error);

    return res.status(400).json({
      message: "Failed to update project",
      error: error.message,
    });
  }
};

// DELETE PROJECT AND ITS LINKED TASKS
const deleteProject = async (req, res) => {
  try {
    const project = await findUserProject(
      req.params.id,
      getUserId(req)
    );

    if (!project) {
      return res.status(404).json({
        message: "Project not found",
      });
    }

    // Remove tasks belonging to this project and this user.
    await Task.deleteMany({
      project: project._id,
      user: getUserId(req),
    });

    await Project.deleteOne({
      _id: project._id,
      user: getUserId(req),
    });

    return res.status(200).json({
      message: "Project and its linked tasks deleted successfully",
    });
  } catch (error) {
    console.error("Delete Project Error:", error);

    return res.status(500).json({
      message: "Failed to delete project",
      error: error.message,
    });
  }
};

module.exports = {
  createProject,
  getProjects,
  getProjectById,
  updateProject,
  deleteProject,
};