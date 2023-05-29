const { Router } = require("express");
const {
  sendMessage,
  getMessage,
  getMembers,
  getAll,
} = require("../controllers/chat/messageController");
const { isAuthenticatedUser } = require("../middlewares/Auth");

const router = Router();

router.post("/send-message", isAuthenticatedUser, sendMessage);
router.get("/get-message/:SenderID", isAuthenticatedUser, getMessage);
router.get("/get-members", isAuthenticatedUser, getMembers);
router.get("/all", isAuthenticatedUser, getAll);

module.exports = router;
