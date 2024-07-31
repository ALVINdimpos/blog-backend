import { Request, Response } from "express";
import { validationResult, body, param } from "express-validator";
import logger from "../logs/logger";
import { models } from "../models";
import { Includeable } from "sequelize/types";
const { Post, User, Comment } = models;

// Extend the Request interface to include user property
interface AuthenticatedRequest extends Request {
  user?: {
    id: number;
  };
}

export const createPost = [
  body("title").notEmpty().withMessage("Title is required"),
  body("content").notEmpty().withMessage("Content is required"),

  async (req: AuthenticatedRequest, res: Response): Promise<Response> => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      logger.error("Create Post: Error in validation", {
        errors: errors.array(),
      });
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { title, content } = req.body;
      const userId = req.user?.id;

      const post = await Post.create({
        title,
        content,
        userId,
      });

      logger.info("Create Post: Post created successfully");
      return res.status(201).json(post);
    } catch (error) {
      logger.error("Create Post: Error in creating post", { error });
      return res.status(500).json({ message: "Error creating post" });
    }
  },
];

export const getPosts = async (
  _req: Request,
  res: Response,
): Promise<Response> => {
  try {
    const posts = await Post.findAll({
      include: [
        {
          model: User,
          as: "user",
          attributes: ["id", "username", "email"],
        },
        {
          model: Comment,
          as: "comments",
          include: [
            {
              model: User,
              as: "user",
              attributes: ["id", "username"],
            },
          ],
        },
      ] as Includeable[],
    });
    return res.status(200).json(posts);
  } catch (error) {
    logger.error("Get Posts: Error in fetching posts", { error });
    return res.status(500).json({ message: "Error fetching posts" });
  }
};

export const getPost = [
  param("id").isInt().withMessage("Post ID must be an integer"),

  async (req: Request, res: Response): Promise<Response> => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      logger.error("Get Post: Error in validation", { errors: errors.array() });
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { id } = req.params;
      const post = await Post.findByPk(id, {
        include: [
          {
            model: User,
            as: "user",
            attributes: ["id", "username", "email"],
          },
          {
            model: Comment,
            as: "comments",
            include: {
              model: User,
              as: "user",
              attributes: ["id", "username"],
            },
          },
        ] as Includeable[],
      });
      if (!post) {
        return res.status(404).json({ message: "Post not found" });
      }
      return res.status(200).json(post);
    } catch (error) {
      logger.error("Get Post: Error in fetching post", { error });
      return res.status(500).json({ message: "Error fetching post" });
    }
  },
];

export const updatePost = [
  param("id").isInt().withMessage("Post ID must be an integer"),
  body("title").notEmpty().withMessage("Title is required"),
  body("content").notEmpty().withMessage("Content is required"),

  async (req: AuthenticatedRequest, res: Response): Promise<Response> => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      logger.error("Update Post: Error in validation", {
        errors: errors.array(),
      });
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { id } = req.params;
      const { title, content } = req.body;
      const userId = req.user?.id;

      const post = await Post.findByPk(id);
      if (!post) {
        return res.status(404).json({ message: "Post not found" });
      }

      if (post.userId !== userId) {
        return res
          .status(403)
          .json({ message: "You can only edit your own posts" });
      }

      post.title = title;
      post.content = content;
      await post.save();

      logger.info("Update Post: Post updated successfully");
      return res.status(200).json(post);
    } catch (error) {
      logger.error("Update Post: Error in updating post", { error });
      return res.status(500).json({ message: "Error updating post" });
    }
  },
];

export const deletePost = [
  param("id").isInt().withMessage("Post ID must be an integer"),

  async (req: AuthenticatedRequest, res: Response): Promise<Response> => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      logger.error("Delete Post: Error in validation", {
        errors: errors.array(),
      });
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { id } = req.params;
      const userId = req.user?.id;

      const post = await Post.findByPk(id);
      if (!post) {
        return res.status(404).json({ message: "Post not found" });
      }

      if (post.userId !== userId) {
        return res
          .status(403)
          .json({ message: "You can only delete your own posts" });
      }

      await post.destroy();

      logger.info("Delete Post: Post deleted successfully");
      return res.status(204).json({ message: "Post deleted successfully" });
    } catch (error) {
      logger.error("Delete Post: Error in deleting post", { error });
      return res.status(500).json({ message: "Error deleting post" });
    }
  },
];
