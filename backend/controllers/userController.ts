import { Request, Response, NextFunction } from "express";
import { ApiError } from "../utils/ApiError";
import bcrypt from "bcrypt";
import { User, UserFollow, Post, PostLike } from "../models/index";
import { Op } from "sequelize";

// Get the current user's details
export const getUser = async (req: Request, res: Response, next: NextFunction) => {
  if (!req.user) {
    return next(new ApiError(401, "Unauthorized"));
  }

  const { userId } = req.user;

  try {
    const user = await User.findByPk(userId, {
      attributes: { exclude: ["password"] }
    });
    if (!user) {
      return next(new ApiError(404, "User not found"));
    }

    const postCount = await Post.count({ where: { userId } });

    const followerCount = await UserFollow.count({ where: { followingId: userId } });

    const followingCount = await UserFollow.count({ where: { followerId: userId } });

    res.status(200).json({
      user: {
        ...user.toJSON(),
        postCount,
        followerCount,
        followingCount,
      }
    });
  } catch (error) {
    return next(new ApiError(500, "Failed to fetch user details"));
  }
};

// Get a user by ID
export const getUserById = async (req: Request, res: Response, next: NextFunction) => {
  if (!req.user) {
    return next(new ApiError(401, "Unauthorized"));
  }

  const { id } = req.params;

  try {
    const user = await User.findByPk(id, {
      attributes: { exclude: ["password"] }
    });
    if (!user) {
      return next(new ApiError(404, "User not found"));
    }

    const postCount = await Post.count({ where: { userId: id } });

    const followerCount = await UserFollow.count({ where: { followingId: id } });

    const followingCount = await UserFollow.count({ where: { followerId: id } });

    res.status(200).json({
      user: {
        ...user.toJSON(),
        postCount,
        followerCount,
        followingCount,
      }
    });
  } catch (error) {
    return next(new ApiError(500, "Failed to fetch user by ID"));
  }
};

// get user and his posts by username
export const getUserByUsername = async (req: Request, res: Response, next: NextFunction) => {
  if (!req.user) {
    return next(new ApiError(401, "Unauthorized"));
  }

  const { username } = req.params;

  try {
    const user = await User.findOne({
      where: { username },
      attributes: { exclude: ["password"] }
    });

    if (!user) {
      return next(new ApiError(404, "User not found"));
    }

    const userId = user.userId;
    const postCount = await Post.count({ where: { userId } });
    const followerCount = await UserFollow.count({ where: { followingId: userId } });
    const followingCount = await UserFollow.count({ where: { followerId: userId } });

    // Check if current user is following this user
    let isFollowing = false;
    if (req.user && req.user.userId && req.user.userId !== userId) {
      const follow = await UserFollow.findOne({
        where: {
          followerId: req.user.userId,
          followingId: userId
        }
      });

      if (follow) {
        isFollowing = true;
      } else {
        isFollowing = false;
      }
    }

    // Fetch user's posts with the same structure as getAllPosts
    const posts = await Post.findAll({
      where: { userId },
      attributes: {
        include: [
          [User.sequelize!.literal(`(
            SELECT COUNT(*)
            FROM post_likes AS likes
            WHERE likes.post_id = "Post"."post_id"
          )`), "likesCount"],
          [User.sequelize!.literal(`(
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

    // Get which posts are liked by the current user
    let likedPostIds: Set<string> = new Set();
    if (req.user && req.user.userId) {
      const postIds = posts.map((post: any) => post.postId);
      const userLikes = await PostLike.findAll({
        where: {
          postId: postIds,
          userId: req.user.userId
        }
      });
      likedPostIds = new Set(userLikes.map((like: any) => like.postId));
    }
    const parsedPosts = posts.map((post: any) => {
      const json = post.toJSON();
      return {
        ...json,
        likesCount: Number(json.likesCount),
        commentsCount: Number(json.commentsCount),
        isLiked: likedPostIds.has(post.postId)
      };
    });

    res.status(200).json({
      user: {
        ...user.toJSON(),
        postCount,
        followerCount,
        followingCount,
        isFollowing,
        posts: parsedPosts
      }
    });
  } catch (error) {
    return next(new ApiError(500, "Failed to fetch user by username"));
  }
};

// Update an existing user
export const updateUser = async (req: Request, res: Response, next: NextFunction) => {
  if (!req.user) {
    return next(new ApiError(401, "Unauthorized"));
  }

  const { userId } = req.user;
  const { fullName, bio, country, birthdate, username, email } = req.body;


  if (username || email) {
    const existingUser = await User.findOne({
      where: {
        [Op.or]: [
          { username },
          { email }
        ],
        userId: { [Op.ne]: userId }
      }
    });

    if (existingUser) {
      return next(new ApiError(409, "Username or email already exists."));
    }
  }

  const user = await User.findByPk(userId);
  if (!user) {
    return next(new ApiError(404, "User not found"));
  }

  try {
    user.fullName = fullName || user.fullName;
    user.bio = bio || user.bio;
    user.country = country || user.country;
    user.birthdate = birthdate || user.birthdate;
    user.username = username || user.username;
    user.email = email || user.email;

    if (req.file) {
      user.profilePicture = `${req.file.filename}`;
    }

    await user.save();

    res.status(200).json({ message: "User updated", user });
  } catch (error) {
    return next(new ApiError(500, "Failed to update user"));
  }
};

// Delete a user
export const deleteUser = async (req: Request, res: Response, next: NextFunction) => {
  if (!req.user) {
    return next(new ApiError(401, "Unauthorized"));
  }

  const { userId } = req.user;

  try {
    const user = await User.findByPk(userId);
    if (!user) {
      return next(new ApiError(404, "User not found"));
    }

    await user.destroy();

    res.status(200).json({ message: "User deleted" });
  } catch (error) {
    return next(new ApiError(500, "Failed to delete user"));
  }
};

// Change password
export const changePassword = async (req: Request, res: Response, next: NextFunction) => {
  if (!req.user) {
    return next(new ApiError(401, "Unauthorized"));
  }

  const { currentPassword, newPassword } = req.body;

  console.log("Changing password for user:", req.user.userId);
  console.log("Old Password:", currentPassword);
  console.log("New Password:", newPassword);

  if (!currentPassword || !newPassword) {
    return next(new ApiError(400, "Old password and new password are required"));
  }

  try {
    const user = await User.findByPk(req.user.userId);
    if (!user) {
      return next(new ApiError(404, "User not found"));
    }

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return next(new ApiError(400, "Old password is incorrect"));
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();

    res.status(200).json({ message: "Password changed successfully" });
  } catch (error) {
    return next(new ApiError(500, "Failed to change password"));
  }
};

export const getFollowers = async (req: Request, res: Response, next: NextFunction) => {
  const { userId } = req.params;
  const currentUserId = req.user?.userId;

  try {
    const followers = await UserFollow.findAll({
      where: {
        followingId: userId
      },
      include: [
        {
          model: User,
          as: "follower",
          attributes: ["userId", "username", "profilePicture"]
        }
      ],
      attributes: ["followerId"]
    });

    let followingIds: Set<string> = new Set();
    if (currentUserId) {
      const followings = await UserFollow.findAll({
        where: {
          followerId: currentUserId,
          followingId: followers.map((f: any) => f.followerId)
        },
        attributes: ["followingId"]
      });
      followingIds = new Set(followings.map((f: any) => f.followingId));
    }

    const result = followers.map((follow: any) => ({
      ...follow.follower.toJSON(),
      isFollowing: followingIds.has(follow.followerId)
    }));

    res.status(200).json(result);
  } catch (error) {
    console.log(error);
    return next(new ApiError(500, "Failed to fetch follower list"));
  }
}

export const getFollowings = async (req: Request, res: Response, next: NextFunction) => {
  const { userId } = req.params;
  const currentUserId = req.user?.userId;

  try {
    const followings = await UserFollow.findAll({
      where: {
        followerId: userId
      },
      include: [
        {
          model: User,
          as: "following",
          attributes: ["userId", "username", "profilePicture"]
        }
      ],
      attributes: ["followingId"]
    });

    let followingIds: Set<string> = new Set();
    if (currentUserId) {
      const myFollowings = await UserFollow.findAll({
        where: {
          followerId: currentUserId,
          followingId: followings.map((f: any) => f.followingId)
        },
        attributes: ["followingId"]
      });
      followingIds = new Set(myFollowings.map((f: any) => f.followingId));
    }

    const result = followings.map((follow: any) => ({
      ...follow.following.toJSON(),
      isFollowing: followingIds.has(follow.followingId)
    }));

    res.status(200).json(result);
  } catch (error) {
    return next(new ApiError(500, "Failed to fetch following list"));
  }
}

export const followUser = async (req: Request, res: Response, next: NextFunction) => {
  if (!req.user) {
    return next(new ApiError(401, "Unauthorized"));
  }

  const { userId } = req.user;

  const userToFollow = req.params.userId;

  if (userId == userToFollow) {
    return next(new ApiError(400, "Can't follow yourself"));
  }

  try {
    const result = await UserFollow.create({
      followerId: userId,
      followingId: userToFollow
    })

    res.status(200).json(result);
  } catch (error) {
    return next(new ApiError(500, "Failed to follow user"));
  }
}

export const unfollowUser = async (req: Request, res: Response, next: NextFunction) => {
  if (!req.user) {
    return next(new ApiError(401, "Unauthorized"));
  }

  const { userId } = req.user;

  const userToUnfollow = req.params.userId;

  try {
    const result = await UserFollow.destroy({
      where: {
        followingId: userToUnfollow,
        followerId: userId
      }
    });

    res.status(200).json(result);
  } catch (error) {
    return next(new ApiError(500, "Failed to follow user"));
  }
}