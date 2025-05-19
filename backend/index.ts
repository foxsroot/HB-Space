import dotenv from "dotenv";
dotenv.config();

import express, { json } from "express";
import path from "path"; // Import path for serving static files
import { sequelize } from "./models/index";
import { errorHandler } from "./middlewares/errorHandler";
import authRoutes from "./routes/authRoutes";
import commentRoute from "./routes/commentRoutes";
import userRoutes from "./routes/userRoutes";
import postRoutes from "./routes/postRoutes"; // Import post routes
import cors from "cors";

const app = express();

// Sync the database
sequelize
  .sync()
  .then(() => {
    console.log("Database synced!");
  })
  .catch((err) => {
    console.log("Failed to sync database:", err);
  });

app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}));

app.use(json());

// Serve static files from the uploads directory
app.use("/uploads", express.static(path.join(__dirname, "uploads"))); // Add this line

// Authentication routes
app.use("/auth", authRoutes);

// Comment routes
app.use("/posts/:postId", commentRoute);

// User routes
app.use("/user", userRoutes);

// Post routes
app.use("/posts", postRoutes); // Add post routes

// Error handling middleware
app.use(errorHandler);

app.listen(3000, () => {
  console.log("App started at port 3000");
});