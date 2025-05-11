import dotenv from "dotenv";
dotenv.config();

import express, { json } from "express";
import { sequelize } from "./models/index";
import { errorHandler } from "./middlewares/errorHandler";
import authRoutes from './routes/authRoutes';

const app = express();

// sequelize.sync()
//     .then(() => {
//         console.log("Database synced!");
//     })
//     .catch((err) => {
//         console.log("Failed to sync database:", err);
//     })

app.use(json());

app.use("/auth", authRoutes);

app.use(errorHandler);

app.listen(3000, () => {
    console.log("App started at port 3000");
})