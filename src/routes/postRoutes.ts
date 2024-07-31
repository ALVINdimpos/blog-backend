import { Router } from "express";
import {
  createPost,
  getPosts,
  getPost,
  updatePost,
  deletePost,
} from "../controllers/postController";
import { verifyToken } from "../middleware/authMiddleware";

const router = Router();

router.post("/", verifyToken, createPost);
router.get("/", getPosts);
router.get("/:id", getPost);
router.put("/:id", verifyToken, updatePost);
router.delete("/:id", verifyToken, deletePost);

export default router;
