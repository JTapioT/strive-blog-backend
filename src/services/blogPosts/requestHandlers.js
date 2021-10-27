import { getBlogPostsJSON, writeBlogPostsJSON, saveCoverImages } from "../../lib/fs-tools.js";
import {validationResult} from "express-validator";
import { extname } from "path";
import createHttpError from "http-errors";
import uniqid from "uniqid";
import { pipeline } from "stream";
import getPDFReadableStream from "../../lib/pdf-tools.js";
import axios from "axios";
import striptags from "striptags";


export async function getAllPosts(req,res,next) {
  try {
    // Get all blog posts
    const blogPosts = await getBlogPostsJSON();
    
    // Handle also possible situation where we don't have any blog posts??
    if (!blogPosts.length) {
      next(createHttpError(404, "No blog posts to show."));
    } else {
      if(req.query.title) {
        // Filter by title - maybe later add for author name etc.
        const filteredBlogPosts = blogPosts.filter(blogPost => blogPost.title.toLowerCase().includes(req.query.title));
        res.send(filteredBlogPosts);
      } else {
        // Send response
        res.send(blogPosts);
      }

    }
  } catch (error) {
    console.log(error);
    next(error);
  }
}

export async function getPostById(req,res,next) {
  try {
    // Get all blog posts
    const blogPosts = await getBlogPostsJSON();
  
    // Blog post by id:
    const blogPost = blogPosts.find((blogPost) => blogPost._id === req.params.id);
  
    // If found by id, send response
    // If not, create an error with status 404, including message.
    if (blogPost) {
      res.send(blogPost);
    } else {
      next(
        createHttpError(404, `No blog post found with an id:${req.params.id}`)
      );
    }
  } catch (error) {
    console.log(error);
    next(error);
  }
}

export async function downloadPDF(req,res,next) {
  try {
    res.setHeader("Content-Disposition", `attachment; filename=Blog_${req.params.id}.pdf`);

    // Fetch blog information
    const blogPosts = await getBlogPostsJSON()
    const blogPost = blogPosts.find((blogPost) => blogPost._id === req.params.id);

    // From the homework solution:
    let blogPostImage;
    if(blogPost.cover) {
      const response = await axios.get(blogPost.cover, {
        responseType: "arraybuffer",
      })
      const blogCoverURLParts = blogPost.cover.split("/");
      const fileName = blogCoverURLParts[blogCoverURLParts.length - 1];
      const [extension] = fileName.split(".");
      const base64 = response.data.toString("base64");
      const base64image = `data:image/${extension};base64,${base64}`;
      blogPostImage = {image: base64image, width: 500};
    }

    // Provide for getPDFReadableStream the content to format into pdf:
    const content = [
      blogPostImage,
      {text: blogPost.title, fontSize: 20, bold: true, margin: [0,0,0,40]},
      {text: `Read time: ${blogPost.readTime.value} ${blogPost.readTime.unit}`},
      {text: `Author - ${blogPost.author.name}`}, 
      {text: striptags(blogPost.content), lineHeight: 2}, 
      {text: `Blog post written: ${blogPost.createdAt.slice(0,10)}`}
    ];

    const source = getPDFReadableStream(content);
    const destination = res;

    pipeline(source, destination, (error) => {
      if (error) {
        next(error);}
    });

  } catch (error) {
    next(error);
  }
}

export async function postBlogPost(req,res,next) {
  try {
    // Handle validationResult accordingly
    const errorsList = validationResult(req);
    if (!errorsList.isEmpty()) {
      next(createHttpError(400, { errorsList }));
    }

    // Get all the blogPosts
    const blogPosts = await getBlogPostsJSON();
    //console.log(blogPosts);

    // Create new blogPost object - add also unique id.
    const newBlogPost = {
      _id: uniqid(),
      ...req.body,
      createdAt: new Date(),
      comments: [],
    };

    // Push new blog post to blogPosts
    blogPosts.push(newBlogPost);

    // Overwrite the existing blogPosts.json()
    await writeBlogPostsJSON(blogPosts);

    // Send response
    res.status(201).send({ _id: newBlogPost._id });
  } catch (error) {
    console.log(error);
    next(error);
  }
}

export async function getPostComments(req,res,next) {
  try {
    // Get all blog posts
    const blogPosts = await getBlogPostsJSON();
  
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
  } catch (error) {
    console.log(error);
    next(error);
  }
}

export async function addComment(req,res,next) {
  try {
    // Get all blog posts
    const blogPosts = await getBlogPostsJSON();
  
    // Blog post by id:
    const blogPost = blogPosts.find((blogPost) => blogPost._id === req.params.id);
  
    if (blogPost) {
      // Edit comments array:
      let editedBlogPostComments = [
        ...blogPost.comments,
        { id: uniqid(), name: req.body.name, message: req.body.message },
      ];
      // Overwrite existing comments array of blog post:
      blogPost.comments = editedBlogPostComments;
  
      let index = blogPosts.findIndex(
        (blogPost) => blogPost._id === req.params.id
      );
      // Overwrite existing blogPost
      blogPosts[index] = blogPost;
      // Overwrite blogPosts.json
      await writeBlogPostsJSON(blogPosts);
  
      res.send({ status: "success", message: req.body.message });
    } else {
      next(
        createHttpError(404, `No blog post found with an id:${req.params.id}`)
      );
    }
  } catch (error) {
    console.log(error);
    next(error);
  }
}

export async function deletePostComment(req,res,next) {
  try {
    // Get all blog posts
    const blogPosts = await getBlogPostsJSON();
  
    // Blog post by id:
    const blogPost = blogPosts.find((blogPost) => blogPost._id === req.params.id);
  
    if (blogPost) {
      // Filter
      let currentComments = blogPost.comments.filter(
        (comment) => comment.id !== req.params.commentId
      );
  
      console.log(currentComments);
  
      // Overwrite existing comments array of blog post:
      blogPost.comments = currentComments;
  
      let index = blogPosts.findIndex(
        (blogPost) => blogPost._id === req.params.id
      );
      // Overwrite existing blogPost
      blogPosts[index] = blogPost;
      // Overwrite blogPosts.json
      await writeBlogPostsJSON(blogPosts);
  
      res.status(204).send();
    } else {
      next(
        createHttpError(404, `No blog post found with an id:${req.params.id}`)
      );
    }
  } catch (error) {
    console.log(error);
    next(error);
  }
}

export async function uploadBlogPostCoverImg(req,res,next) {
  try {
    //const fileExtension = extname(req.file.originalname);
    //const fileName = `${req.params.id}${fileExtension}`;
    //console.log(fileName);
  
    //await saveCoverImages(fileName, req.file.buffer);
    
    // Update blogPost cover accordingly:
    let blogPosts = await getBlogPostsJSON();
    let index = blogPosts.findIndex((blogPost) => blogPost._id === req.params.id);
    
    let editedBlogPost = {
      ...blogPosts[index],
      cover: req.file.path,
    };
    
    blogPosts[index] = editedBlogPost;
    await writeBlogPostsJSON(blogPosts);

    console.log("HERE IS THE FILE PATH")
    console.log(req.file.path);
    
    res.status(201).send({ status: "success" });
  } catch (error) {
    console.log(error);
    next(error);
  }
}

export async function updateBlogPost(req,res,next) {
  try {
    // Get all blogPosts
    const blogPosts = await getBlogPostsJSON();
  
    // Find index of a blogPost within blogPosts
    const index = blogPosts.findIndex(
      (blogPost) => blogPost._id === req.params.id
    );
  
    // If -1 is being returned from findIndex - falsy value
    if (index === -1) {
      next(createHttpError(404, `No blog post with an id: ${req.params.id}`));
    }
  
    // Create an object with information from blog post, overwrite necessary.
    const editedBlogPost = { ...blogPosts[0], ...req.body };
    blogPosts[index] = editedBlogPost;
  
    // Overwrite blogPosts.json
    await writeBlogPostsJSON(blogPosts);
  
    // Send response
    res.status(200).send(editedBlogPost);
  } catch (error) {
    console.log(error);
    next(error)
  }
}


export async function deleteBlogPost(req,res,next) {
  try {
    // Get all blogPosts
    const blogPosts = await getBlogPostsJSON();

    // Filter out the blogPost by id from other blogPosts
    const currentBlogPosts = blogPosts.filter(
      (blogPost) => blogPost._id !== req.params.id
    );

    // Overwrite existing blogPosts.json
    await writeBlogPostsJSON(currentBlogPosts);

    // Send response
    res.status(204).send();
  } catch (error) {
    console.log(error);
    next(error);
  }
}

