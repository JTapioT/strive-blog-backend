import express from "express";
import multer from "multer";
import { blogPostValidation } from "../../validation.js";
import { deletePostComment, getAllPosts, getPostById, getPostComments, postComment, updateBlogPost, uploadBlogPostCoverImg, deleteBlogPost, postBlogPost } from "./requestHandlers.js";
//import { singleFileHandler } from "./middleware.js";



// Router
const blogPostsRouter = express.Router();

// GET /blogPosts
blogPostsRouter.get("/", getAllPosts);

// GET /blogPosts/:id
blogPostsRouter.get("/:id", getPostById);

// GET /blogPosts/:id/comments
blogPostsRouter.get("/:id/comments", getPostComments)

// POST /blogPosts
blogPostsRouter.post("/", blogPostValidation, postBlogPost);

// POST /blogPosts/:id/comments 
blogPostsRouter.post("/:id/comments", postComment)

// POST /blogPosts/:id/uploadCover
blogPostsRouter.post("/:id/uploadCover", multer().single("coverPhoto"), uploadBlogPostCoverImg);

// PUT /blogPosts/:id
blogPostsRouter.put("/:id", updateBlogPost);

// DELETE /blogPosts/:id
blogPostsRouter.delete("/:id", deleteBlogPost);

// DELETE /blogPosts/:id/comments/:commentId
blogPostsRouter.delete("/:id/comments/:commentId", deletePostComment)

export default blogPostsRouter;