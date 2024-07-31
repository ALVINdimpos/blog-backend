import { Router } from "express";
import {
  createComment,
  getCommentsByPost,
  updateComment,
  deleteComment,
} from "../controllers/commentController";
import { verifyToken } from "../middleware/authMiddleware";

const router = Router();

router.post("/", verifyToken, createComment);
router.get("/:postId", getCommentsByPost);
router.put("/:id", verifyToken, updateComment);
router.delete("/:id", verifyToken, deleteComment);

export default router;
