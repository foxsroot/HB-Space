import { Request, Response, NextFunction } from "express";
import { Post } from "../models/Post";
import { ApiError } from "../utils/ApiError";

export const getAllPosts = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const posts = await Post.findAll({
      include: ["user", "likes", "comments"],
    });
    res.status(200).json({ posts });
  } catch (error) {
    next(new ApiError(500, "Failed to fetch posts"));
  }
};

// Create a new post
export const createPost = async (req: Request, res: Response, next: NextFunction) => {
  if (!req.user) {
    return next(new ApiError(401, "Unauthorized"));
  }

  const { caption } = req.body;
  const image = req.file?.path;

  if (!image || !caption) {
    return next(new ApiError(400, "Image and caption are required"));
  }

  try {
    const newPost = await Post.create({
      userId: req.user.userId,
      image,
      caption,
    });

    res.status(201).json({ message: "Post created successfully", post: newPost });
  } catch (error) {
    next(new ApiError(500, "Failed to create post"));
  }
};

export const getPostById = async (req: Request, res: Response, next: NextFunction) => {
  const { postId } = req.params;

  try {
    const post = await Post.findByPk(postId, {
      include: ["user", "likes", "comments"], // Include related models
    });
    if (!post) {
      return next(new ApiError(404, "Post not found"));
    }

    res.status(200).json({ post });
  } catch (error) {
    next(new ApiError(500, "Failed to fetch post"));
  }
};

export const updatePost = async (req: Request, res: Response, next: NextFunction) => {
  if (!req.user) {
    return next(new ApiError(401, "Unauthorized"));
  }

  const { postId } = req.params;
  const { caption } = req.body;
  const image = req.file?.path; 

  try {
    const post = await Post.findByPk(postId);
    if (!post) {
      return next(new ApiError(404, "Post not found"));
    }

    if (post.userId !== req.user.userId) {
      return next(new ApiError(403, "You are not authorized to edit this post"));
    }

    post.caption = caption || post.caption;
    post.image = image || post.image;

    await post.save();

    res.status(200).json({ message: "Post updated successfully", post });
  } catch (error) {
    next(new ApiError(500, "Failed to update post"));
  }
};

export const deletePost = async (req: Request, res: Response, next: NextFunction) => {
  if (!req.user) {
    return next(new ApiError(401, "Unauthorized"));
  }

  const { postId } = req.params;

  try {
    const post = await Post.findByPk(postId);
    if (!post) {
      return next(new ApiError(404, "Post not found"));
    }

    if (post.userId !== req.user.userId) {
      return next(new ApiError(403, "You are not authorized to delete this post"));
    }

    await post.destroy();

    res.status(200).json({ message: "Post deleted successfully" });
  } catch (error) {
    next(new ApiError(500, "Failed to delete post"));
  }
};