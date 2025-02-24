const express = require("express");
const { sendMessage, fetchMessages } = require("../controllers/messageController");
const router = express.Router();

router.post("/send", sendMessage);
router.get("/:userId", fetchMessages);

module.exports = router;
