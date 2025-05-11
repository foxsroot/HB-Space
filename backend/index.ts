import dotenv from "dotenv";
dotenv.config();

import express, { json } from "express";
import { sequelize } from "./models/index";
import { errorHandler } from "./middlewares/errorHandler";
import authRoutes from "./routes/authRoutes";
import commentRoute from "./routes/commentRoutes";
import userRoutes from "./routes/userRoutes"; // Import profile routes

const app = express();

// Sync the database
// sequelize
//   .sync()
//   .then(() => {
//     console.log("Database synced!");
//   })
//   .catch((err) => {
//     console.log("Failed to sync database:", err);
//   });

app.use(json());

// Authentication routes
app.use("/auth", authRoutes);

// Comment routes
app.use("/post/:postId", commentRoute);

// User routes
app.use("/user", userRoutes);

// Error handling middleware
app.use(errorHandler);

app.listen(3000, () => {
  console.log("App started at port 3000");
});