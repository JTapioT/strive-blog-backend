import express from "express";
import fs from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import uniqid from 'uniqid';
import createHttpError from "http-errors";
import { blogPostValidationMiddlewares } from "../../validation.js";
import { validationResult } from "express-validator";
import multer from "multer";
import { saveCoverImages } from "../../lib/fs-tools.js";
import { getBlogPosts, writeBlogPosts } from "../../lib/fs-tools.js";



const currentFilePath = fileURLToPath(import.meta.url); // Current file path, file included within the path
const parentFolderPath = dirname(currentFilePath); // Parent folder path
const blogPostsJSONPath = join(parentFolderPath, "../../data/blogPosts.json");
// Concise way:
// const blogPostsJSONPath = join(dirname(fileURLToPath(import.meta.url)), "../../data/blogPosts.json")

// join(dirname(fileURLToPath(import.meta.url)), "../data")

// Read from blogPosts.json the blogPosts.
/* function getBlogPosts() {
  return JSON.parse(fs.readFileSync(blogPostsJSONPath))
}
// Overwrite the blogPosts.json.
function writeBlogPosts(content) {
  fs.writeFileSync(blogPostsJSONPath, JSON.stringify(content));
} */

// Router
const blogPostsRouter = express.Router();


// GET /blogPosts
blogPostsRouter.get("/", (req,res, next) => {
  try {

    // Get all blog posts
    const blogPosts = getBlogPosts();

    // Handle also possible situation where we don't have any blog posts??
    if(!blogPosts.length) {
      next(createHttpError(404, 'No blog posts to show.'))
    } else {
      // Send response
      res.send(blogPosts);
    }

  } catch(error) {
    next(error);
  }
});


// GET /blogPosts/:id
blogPostsRouter.get("/:id", async (req, res, next) => {
  try {

    // Get all blog posts
    const blogPosts = await getBlogPosts();

    // Blog post by id: 
    const blogPost = blogPosts.find(blogPost => blogPost._id === req.params.id)

    // If found by id, send response
    // If not, create an error with status 404, including message.
    if(blogPost) {
      res.send(blogPost);
    } else {
      next(createHttpError(404, `No blog post found with an id:${req.params.id}`))
    }

  } catch(error) {
    next(error);
  }
});

// GET /blogPosts/:id/comments

blogPostsRouter.get("/:id/comments", async (req,res,next) => {
  // Get all blog posts
  const blogPosts = await getBlogPosts();

  // Blog post by id:
  const blogPost = blogPosts.find((blogPost) => blogPost._id === req.params.id);

  // If found by id, send response
  // If not, create an error with status 404, including message.
  if (blogPost) {
    res.send(blogPost.comments);
  } else {
    next(
      createHttpError(404, `No blog post found with an id:${req.params.id}`)
    );
  }
})


// POST :id/comments 
blogPostsRouter.post("/:id/comments", async (req,res,next) => {
  try {
    // Get all blog posts
    const blogPosts = await getBlogPosts();

    // Blog post by id:
    const blogPost = blogPosts.find(
      (blogPost) => blogPost._id === req.params.id
    );

    // If found by id, send response
    // If not, create an error with status 404, including message.
    if (blogPost) {
      // Edit comments array:
      let editedBlogPostComments = [
        ...blogPost.comments,
        { name: req.body.name, message: req.body.message },
      ];
      // Overwrite existing comments array of blog post:
      blogPost.comments = editedBlogPostComments;

      let index = blogPosts.findIndex(
        (blogPost) => blogPost._id === req.params.id
      );
      // Overwrite existing blogPost
      blogPosts[index] = blogPost;
      // Overwrite blogPosts.json
      await writeBlogPosts(blogPosts);

      res.send({ status: "success", message: req.body.message });
    } else {
      next(
        createHttpError(404, `No blog post found with an id:${req.params.id}`)
      );
    }
  } catch (error) {
    next(error);
  }
  
})


// POST /blogPosts
// For now, verbose naming for middleware.. change later.
blogPostsRouter.post("/", blogPostValidationMiddlewares, async (req, res, next) => {
  try {
    // Handle validationResult accordingly
    const errorsList = validationResult(req);
    if (!errorsList.isEmpty()) {
      next(createHttpError(400, { errorsList }));
    }

    // Get all the blogPosts
    const blogPosts = await getBlogPosts();
    //console.log(blogPosts);

    // Create new blogPost object - add also unique id.
    const newBlogPost = {
      _id: uniqid(),
      ...req.body,
      createdAt: new Date(),
      comments: []
    };

    // Push new blog post to blogPosts
    blogPosts.push(newBlogPost);

    // Overwrite the existing blogPosts.json()
    await writeBlogPosts(blogPosts);

    // Send response
    res.status(201).send({ _id: newBlogPost._id });
  } catch (error) {
    next(error);
  }
});



// POST :id/uploadCover
blogPostsRouter.post("/:id/uploadCover", multer().single("coverPhoto"), async (req,res,next) => {
  try {
    // Slice out the file-extension part to add it concatenated with id:
    const fileExtension = req.file.originalname.slice(
      req.file.originalname.indexOf(".")
    );
    const fileName = `${req.params.id}${fileExtension}`;
    //console.log(fileName);

    await saveCoverImages(fileName, req.file.buffer);
    res.status(201).send({ status: "success" });

    // Update blogPost cover accordingly:
    let blogPosts = await getBlogPosts();
    let index = blogPosts.findIndex(blogPost => blogPost._id === req.params.id);

    let editedBlogPost = {...blogPosts[index], cover: `http://localhost:3001/blogImages/${fileName}`}

    blogPosts[index] = editedBlogPost;

    await writeBlogPosts(blogPosts);
  } catch (error) {
    next(error);
  }
});



// PUT /blogPosts/:id
blogPostsRouter.put("/:id", async (req,res,next) => {
  try {
    // Get all blogPosts
    const blogPosts = await getBlogPosts();

    // Find index of a blogPost within blogPosts
    const index = blogPosts.findIndex(blogPost => blogPost._id === req.params.id);

    // If -1 is being returned from findIndex - falsy value
    if(index === -1) {
      next(createHttpError(404, `No blog post with an id: ${req.params.id}`))
    }

    // Create an object with information from blog post, overwrite necessary.
    const editedBlogPost = {...blogPosts[0], ...req.body};
    blogPosts[index] = editedBlogPost;
    
    // Overwrite blogPosts.json
    await writeBlogPosts(blogPosts);

    // Send response
    res.status(200).send(editedBlogPost);

  } catch (error) {
    next(error);
  }
});



// DELETE /blogPosts/:id
blogPostsRouter.delete("/:id", async (req,res,next) => {
  try {
    // Get all blogPosts
    const blogPosts = await getBlogPosts();

    // Filter out the blogPost by id from other blogPosts
    const currentBlogPosts = blogPosts.filter(blogPost => blogPost._id !== req.params.id);

    // Overwrite existing blogPosts.json
    await writeBlogPosts(currentBlogPosts);

    // Send response
    res.status(204).send();

  } catch (error) {
    next(error);
  }
});


export default blogPostsRouter;