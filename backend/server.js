const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const dns = require("dns");

// Use Google DNS for MongoDB SRV lookups
dns.setServers(["8.8.8.8", "8.8.4.4"]);

dotenv.config();

const chatRoutes = require("./routes/chatRoutes");
const authRoutes = require("./routes/authRoutes");
const taskRoutes = require("./routes/taskRoutes");
const projectRoutes = require("./routes/projectRoutes");

const app = express();

app.use(cors());
app.use(express.json());

// API routes
app.use("/api/auth", authRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/chat", chatRoutes);

// Backend health check
app.get("/", (req, res) => {
  res.json({
    message: "TaskFlow Backend is running successfully!",
  });
});

// Connect to MongoDB, then start the server
const PORT = process.env.PORT || 5000;

mongoose
  .connect(process.env.MONGO_URI, {
    serverSelectionTimeoutMS: 15000,
  })
  .then(() => {
    console.log("MongoDB connected successfully");

    app.listen(PORT, "0.0.0.0", () => {
      console.log(`TaskFlow Backend running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("MongoDB connection failed:");
    console.error(error.message);
    process.exit(1);
  });