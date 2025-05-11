import { Sequelize } from "sequelize-typescript";
import { User } from "./User";
import { Comment } from "./Comment";
import { CommentLike } from "./CommentLike";
import { Post } from "./Post";
import { PostLike } from "./PostLike";
import { UserFollow } from "./UserFollow";

const config = require("../config/config.json");

const sequelize = new Sequelize({
    ...config.development,
    models: [User, Comment, CommentLike, Post, PostLike, UserFollow]
});

export { sequelize, User, Comment, CommentLike, Post, PostLike, UserFollow }