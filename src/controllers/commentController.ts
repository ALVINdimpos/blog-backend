import { Request, Response } from "express";
import { validationResult, body, param } from "express-validator";
import logger from "../logs/logger";
import { models } from "../models";

const { Comment, Post, User } = models;

// Extend the Request interface to include user property
interface AuthenticatedRequest extends Request {
  user?: {
    id: number;
  };
}

export const createComment = [
  body("content").notEmpty().withMessage("Content is required"),
  body("postId").isInt().withMessage("Post ID must be an integer"),

  async (req: AuthenticatedRequest, res: Response): Promise<Response> => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      logger.error("Create Comment: Error in validation", {
        errors: errors.array(),
      });
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { content, postId } = req.body;
      const userId = req.user?.id;

      const post = await Post.findByPk(postId);
      if (!post) {
        return res.status(404).json({ message: "Post not found" });
      }

      const comment = await Comment.create({
        content,
        userId,
        postId,
      });

      logger.info("Create Comment: Comment created successfully");
      return res.status(201).json(comment);
    } catch (error) {
      logger.error("Create Comment: Error in creating comment", { error });
      return res.status(500).json({ message: "Error creating comment" });
    }
  },
];

export const getCommentsByPost = [
  param("postId").isInt().withMessage("Post ID must be an integer"),

  async (req: Request, res: Response): Promise<Response> => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      logger.error("Get Comments: Error in validation", {
        errors: errors.array(),
      });
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { postId } = req.params;

      const post = await Post.findByPk(postId);
      if (!post) {
        return res.status(404).json({ message: "Post not found" });
      }

      const comments = await Comment.findAll({
        where: { postId },
        include: [User],
      });
      return res.status(200).json(comments);
    } catch (error) {
      logger.error("Get Comments: Error in fetching comments", { error });
      return res.status(500).json({ message: "Error fetching comments" });
    }
  },
];

export const updateComment = [
  param("id").isInt().withMessage("Comment ID must be an integer"),
  body("content").notEmpty().withMessage("Content is required"),

  async (req: AuthenticatedRequest, res: Response): Promise<Response> => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      logger.error("Update Comment: Error in validation", {
        errors: errors.array(),
      });
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { id } = req.params;
      const { content } = req.body;
      const userId = req.user?.id;

      const comment = await Comment.findByPk(id);
      if (!comment) {
        return res.status(404).json({ message: "Comment not found" });
      }

      if (comment.userId !== userId) {
        return res
          .status(403)
          .json({ message: "You can only edit your own comments" });
      }

      comment.content = content;
      await comment.save();

      logger.info("Update Comment: Comment updated successfully");
      return res.status(200).json(comment);
    } catch (error) {
      logger.error("Update Comment: Error in updating comment", { error });
      return res.status(500).json({ message: "Error updating comment" });
    }
  },
];

export const deleteComment = [
  param("id").isInt().withMessage("Comment ID must be an integer"),

  async (req: AuthenticatedRequest, res: Response): Promise<Response> => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      logger.error("Delete Comment: Error in validation", {
        errors: errors.array(),
      });
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { id } = req.params;
      const userId = req.user?.id;

      const comment = await Comment.findByPk(id);
      if (!comment) {
        return res.status(404).json({ message: "Comment not found" });
      }

      if (comment.userId !== userId) {
        return res
          .status(403)
          .json({ message: "You can only delete your own comments" });
      }

      await comment.destroy();

      logger.info("Delete Comment: Comment deleted successfully");
      return res.status(204).send();
    } catch (error) {
      logger.error("Delete Comment: Error in deleting comment", { error });
      return res.status(500).json({ message: "Error deleting comment" });
    }
  },
];
