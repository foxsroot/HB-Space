import { Request, Response, NextFunction } from "express";
import { User } from "../models/User";
import { ApiError } from "../utils/ApiError";
import bcrypt from "bcrypt";

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
  const { fullName, bio, country, birthdate } = req.body;

  try {
    const user = await User.findByPk(userId);
    if (!user) {
      return next(new ApiError(404, "User not found"));
    }

    user.fullName = fullName || user.fullName;
    user.bio = bio || user.bio;
    user.country = country || user.country;
    user.birthdate = birthdate || user.birthdate;

    // If a file was uploaded, update the profilePicture field
    if (req.file) {
      user.profilePicture = `/uploads/${req.file.filename}`;
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

  const { oldPassword, newPassword } = req.body;
  if (!oldPassword || !newPassword) {
    return next(new ApiError(400, "Old password and new password are required"));
  }

  try {
    const user = await User.findByPk(req.user.userId);
    if (!user) {
      return next(new ApiError(404, "User not found"));
    }

    const isMatch = await bcrypt.compare(oldPassword, user.password);
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