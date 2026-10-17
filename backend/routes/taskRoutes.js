const express = require("express");

const router = express.Router();

const {
    createTask,
    getTasks,
    getTaskById,
    updateTask,
    deleteTask
} = require("../controllers/taskController");

const authMiddleware = require("../middleware/authMiddleware");

// Create task
router.post(
    "/",
    authMiddleware,
    createTask
);

// Get all tasks
router.get(
    "/",
    authMiddleware,
    getTasks
);

// Get single task
router.get(
    "/:id",
    authMiddleware,
    getTaskById
);

// Update task
router.put(
    "/:id",
    authMiddleware,
    updateTask
);

// Delete task
router.delete(
    "/:id",
    authMiddleware,
    deleteTask
);

module.exports = router;