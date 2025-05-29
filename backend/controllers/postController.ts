import { Request, Response, NextFunction } from "express";
import { ApiError } from "../utils/ApiError";
import { PostLike, User, Comment, Post, sequelize, UserFollow } from "../models/index";
import { getComments } from "../services/commentServices";

export const getAllPosts = async (req: Request, res: Response, next: NextFunction) => {
  if (!req.user) {
    return next(new ApiError(401, "Unauthorized"));
  }

  try {
    const posts = await Post.findAll({
      attributes: {
        include: [
          [sequelize.literal(`(
        SELECT COUNT(*)
        FROM post_likes AS likes
        WHERE likes.post_id = "Post"."post_id"
        )`), "likesCount"],
          [sequelize.literal(`(
        SELECT COUNT(*)
        FROM comments AS comments
        WHERE comments.post_id = "Post"."post_id"
        )`), "commentsCount"]
        ]
      },
      include: [
        {
          model: User,
          as: "user",
          attributes: ['userId', 'username', 'profilePicture', 'fullName']
        }
      ]
    });

    const postIds = posts.map((post: any) => post.postId);

    const userLikes = await PostLike.findAll({
      where: {
        postId: postIds,
        userId: req.user.userId
      }
    });

    const likedPostIds = new Set(userLikes.map((like: any) => like.postId));

    const parsedPosts = posts.map((post: any) => {
      const json = post.toJSON();
      return {
        ...json,
        likesCount: Number(json.likesCount),
        commentsCount: Number(json.commentsCount),
        isLiked: likedPostIds.has(post.postId)
      };
    });

    res.status(200).json({ posts: parsedPosts });
  } catch (error) {
    console.error("Error:", error);
    next(new ApiError(500, "Failed to fetch posts"));
  }
};

export const getFeeds = async (req: Request, res: Response, next: NextFunction) => {
  if (!req.user) {
    return next(new ApiError(401, "Unauthorized"));
  }

  try {
    const follows = await UserFollow.findAll({
      where: { followerId: req.user.userId },
    })

    const followedUserIds = follows?.map((follow: any) => follow.followingId) || [];

    if (followedUserIds.length === 0) {
      res.status(200).json({ posts: [] });
      return;
    }

    const posts = await Post.findAll({
      where: {
        userId: followedUserIds
      },
      attributes: {
        include: [
          [sequelize.literal(`(
        SELECT COUNT(*)
        FROM post_likes AS likes
        WHERE likes.post_id = "Post"."post_id"
        )`), "likesCount"],
          [sequelize.literal(`(
        SELECT COUNT(*)
        FROM comments AS comments
        WHERE comments.post_id = "Post"."post_id"
        )`), "commentsCount"]
        ]
      },
      include: [
        {
          model: User,
          as: "user",
          attributes: ['userId', 'username', 'profilePicture', 'fullName']
        }
      ]
    });

    const postIds = posts.map((post: any) => post.postId);

    const userLikes = await PostLike.findAll({
      where: {
        postId: postIds,
        userId: req.user.userId
      }
    });

    const likedPostIds = new Set(userLikes.map((like: any) => like.postId));

    const parsedPosts = posts.map((post: any) => {
      const json = post.toJSON();
      return {
        ...json,
        likesCount: Number(json.likesCount),
        commentsCount: Number(json.commentsCount),
        isLiked: likedPostIds.has(post.postId)
      };
    });

    res.status(200).json({ posts: parsedPosts });
    return;
  } catch (error) {
    console.error("Error:", error);
    next(new ApiError(500, "Failed to fetch feeds"));
  }
};

export const createPost = async (req: Request, res: Response, next: NextFunction) => {
  if (!req.user) {
    return next(new ApiError(401, "Unauthorized"));
  }

  const { caption } = req.body;
  let image = req.file?.filename;

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
  if (!req.user) {
    return next(new ApiError(401, "Unauthorized"));
  }

  const { postId } = req.params;

  try {
    const post = await Post.findByPk(postId, {
      attributes: {
        include: [
          [sequelize.fn("COUNT", sequelize.col("likes.post_id")), "likesCount"],
        ]
      },
      include: [
        {
          model: User,
          as: "user",
          attributes: ['userId', 'username', 'profilePicture', 'fullName']
        },
        {
          model: PostLike,
          as: "likes",
          attributes: []
        },
      ],
      group: ["Post.post_id", "user.user_id"],
    });
    if (!post) {
      return next(new ApiError(404, "Post not found"));
    }

    post.dataValues.likesCount = parseInt(post.dataValues.likesCount as string, 10) || 0;

    // Add isLiked for the current user
    let isLiked = false;
    if (req.user && req.user.userId) {
      const like = await PostLike.findOne({
        where: { postId, userId: req.user.userId }
      });
      isLiked = !!like;
    }
    post.dataValues.isLiked = isLiked;

    // Add isFollowing for the current user
    let isFollowing = false;
    if (req.user && req.user.userId && post.user?.userId) {
      const follow = await UserFollow.findOne({
        where: {
          followerId: req.user.userId,
          followingId: post.user.userId
        }
      });
      isFollowing = !!follow;
    }
    post.dataValues.isFollowing = isFollowing;

    const { comments } = await getComments(postId, req.user.userId);
    post.dataValues.comments = comments ?? [];

    res.status(200).json(post);
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
  let image = req.file?.filename;

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

export const getLikes = async (req: Request, res: Response, next: NextFunction) => {
  const { postId } = req.params;

  try {
    const likes = await PostLike.findAll({
      where: { postId },
      include: [
        {
          model: User,
          attributes: ['userId', 'username', 'profilePicture']
        }
      ]
    });

    const likedBy = likes.map(like => like.user);

    res.status(200).json({ postId, likedBy });
  } catch (error) {
    next(new ApiError(500, "Failed to fetch list of users"));
  }
}

export const likePost = async (req: Request, res: Response, next: NextFunction) => {
  if (!req.user) {
    return next(new ApiError(401, "Unauthorized"));
  }

  const { postId } = req.params;
  const { userId } = req.user;

  try {
    const post = await Post.findByPk(postId);

    if (!post) {
      return next(new ApiError(404, "Post not found"));
    }

    const alreadyLiked = await PostLike.findOne({
      where: { postId, userId }
    });

    if (alreadyLiked) {
      return next(new ApiError(409, "You have already liked this post"));
    }

    const newLike = await PostLike.create({
      postId,
      userId
    });

    res.status(201).json({ message: "Post liked", like: newLike });
  } catch (error) {
    next(new ApiError(500, "Failed to like post"));
  }
}

export const unlikePost = async (req: Request, res: Response, next: NextFunction) => {
  if (!req.user) {
    return next(new ApiError(401, "Unauthorized"));
  }

  const { postId } = req.params;
  const { userId } = req.user;

  try {
    const post = await Post.findByPk(postId);

    if (!post) {
      return next(new ApiError(404, "Post not found"));
    }

    const liked = await PostLike.findOne({
      where: { postId, userId }
    });

    if (!liked) {
      return next(new ApiError(404, "Like not found"));
    }

    await liked.destroy();

    res.status(200).json({ message: "post unliked" });
  } catch (error) {
    next(new ApiError(500, "Failed to unlike post"));
  }
}