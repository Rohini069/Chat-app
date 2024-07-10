const express = require("express");
const { protect } = require("../middleware/authMiddleware");
const { sendMessage } = require("../Controllers/messageController");
const { allMessages } = require("../Controllers/messageController");
const app = express();

const router = express.Router();

router.route("/:chatId").get(protect, allMessages);
router.route("/").post(protect, sendMessage);

module.exports = router;
