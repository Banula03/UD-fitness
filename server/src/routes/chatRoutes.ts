import express from "express";
import { getMessages } from "../controllers/chatController";

const router = express.Router();

router.get("/:userId1/:userId2", getMessages);

export default router;
