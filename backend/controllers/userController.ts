import { Request, Response, NextFunction } from "express";
import { User } from "../models/User";
import { ApiError } from "../utils/ApiError";

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

    res.status(200).json({ user });
  } catch (error) {
    return next(new ApiError(500, "Failed to fetch user details"));
  }
};

// Get a user by ID
export const getUserById = async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;

  try {
    const user = await User.findByPk(id, {
      attributes: { exclude: ["password"] }
    });
    if (!user) {
      return next(new ApiError(404, "User not found"));
    }

    res.status(200).json({ user });
  } catch (error) {
    return next(new ApiError(500, "Failed to fetch user by ID"));
  }
};

// Update an existing user
export const updateUser = async (req: Request, res: Response, next: NextFunction) => {
  if (!req.user) {
    return next(new ApiError(401, "Unauthorized"));
  }

  const { userId } = req.user;
  const { username, email, fullName, bio, country, birthdate, profilePicture } = req.body;

  try {
    const user = await User.findByPk(userId);
    if (!user) {
      return next(new ApiError(404, "User not found"));
    }

    user.username = username || user.username;
    user.email = email || user.email;
    user.fullName = fullName || user.fullName;
    user.bio = bio || user.bio;
    user.country = country || user.country;
    user.birthdate = birthdate || user.birthdate;
    user.profilePicture = profilePicture || user.profilePicture;

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