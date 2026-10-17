const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const {
  sendChatMessage,
} = require("../controllers/chatController");

router.post("/", authMiddleware, sendChatMessage);

module.exports = router;