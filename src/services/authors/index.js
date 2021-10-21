import express, { response } from 'express';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import uniqid from 'uniqid';
import createHttpError from "http-errors";
import { validationResult } from "express-validator";
import { authorValidationMiddlewares } from '../../validation.js';
import multer from 'multer';
import { saveAvatarImages } from '../../lib/fs-tools.js';


const authorsRouter = express.Router();

const currentFilePath = fileURLToPath(import.meta.url); // Current file path, file included within the path
const parentFolderPath = dirname(currentFilePath); // Parent folder path
// Managed to understand relative path somehow. Now I can have authors.json within separate 'data' -folder.
const authorsJSONPath = join(parentFolderPath, "../../data/authors.json");

// const authorsJSONPath = join(dirname(fileURLToPath(import.meta.url)), "../../data/authors.json")

// Concise functions:
// const getAuthors = () => JSON.parse(fs.readFileSync(authorsJSONPath))
// const writeAuthors = (content) => fs.writeFileSync(authorsJSONPath, JSON.stringify(content))

function getAuthors() {
  return JSON.parse(fs.readFileSync(authorsJSONPath));
}

function writeAuthors(content) {
  fs.writeFileSync(authorsJSONPath, JSON.stringify(content));
}

// Return list of all authors - GET
authorsRouter.get("/", (req,res, next) => {

  try {
    // Get authors, [{},{}..]
    const authors = getAuthors();
    // Handle possible situation where we don't have any authors?
    if(!authors.length) {
      next(createHttpError(404, "No authors to show."));
    } else {
      res.send(authors);
    }
    
  } catch (error) {
    next(error);
  }
})



// Return a single author by id - GET
// I need to use parseInt() since existing author.id is in a string form.
authorsRouter.get("/:id", (req,res, next) => {
  try {
    // Read authors.json
    const authors = getAuthors();

    // Find author from authors by id which is provided with request params
    const author = authors.find(author => author.id === parseInt(req.params.id));

    // Handle non-existing author by requested id
    if(!author) {
      next(createHttpError(404, `No author found with an id: ${req.params.id}`))
    } else {
      // Send response
      res.send(author);
    }

  } catch (error) {
    next(error);
  }
})



// Create a new author - POST
authorsRouter.post("/", authorValidationMiddlewares, (req,res, next) => {

  try {
    // Read authors.json
    const authors = getAuthors();
  
    // Create new author - add random id
    let newAuthor = {
      ...req.body,
      id: uniqid(),
      avatar: `http://localhost:3001/public/avatarImages/${id}`,
      createdAt: new Date()
    };
  
    // Push new author to existing authors array
    authors.push(newAuthor);

    // Overwrite existing authors.json
    writeAuthors(authors);
  
    // Send response
    res.status(201).send({id: newAuthor.id});
    
  } catch (error) {
    next(error);
  }
})

// Upload author avatar image - POST
authorsRouter.post("/:id/uploadAvatar", multer().single("avatar"), async (req, res, next) => {
  try {
    // Slice out the file-extension part to add it concatenated with id:
    const fileExtension = req.file.originalname.slice(
      req.file.originalname.indexOf(".")
    );
    const fileName = `${req.params.id}${fileExtension}`
    //console.log(fileName);

    await saveAvatarImages(fileName, req.file.buffer);
    res.status(201).send({ status: "success" });
    // Update the author avatar accordingly within author information:
    let authors = getAuthors();
    let index = authors.findIndex(author => author.id === parseInt(req.params.id));
    
    let editedAuthor = {...authors[index], avatar: `http://localhost:3001/authorImages/${fileName}`};
    authors[index] = editedAuthor;

    writeAuthors(authors);


  } catch (error) {
    next(error);
  }
 
})


// Check that same e-mail does not exist already - POST
authorsRouter.post("/checkEmail", (req,res, next) => {
  try {
    const authors = getAuthors();
    let response =
      authors.findIndex(
        (author) => author.email.toLowerCase() === req.body.email.toLowerCase()
      ) === undefined
        ? false
        : true;
    
    res.status(200).send({ value: response });
  } catch (error) {
    next(error);
  }
})



// Edit the author with the given id - PUT
authorsRouter.put("/:id", (req,res, next) => {
  try {
    // Read authors.json
    const authors = getAuthors();

    // Find index of an author within authors:
    let index = authors.findIndex(
      (author) => author.id === parseInt(req.params.id)
    );

    if(index === -1) {
      next(createHttpError(404, `No author found with an id: ${req.params.id}`))
    } else {
      // Modify the existing author
      let editedAuthor = { ...authors[index], ...req.body };
      authors[index] = editedAuthor;

      // Overwrite authors.json
      writeAuthors(authors);
  
      // Send response
      res.status(200).send(editedAuthor);
    }

  } catch (error) {
    next(error);
  }
})




// Delete the author by id - DELETE
authorsRouter.delete("/:id", (req,res, next) => {
  try {
    // Read authors.json
    const authors = getAuthors();

    // Filter out the author from authors
    let currentAuthors = authors.filter(
      (author) => author.id !== parseInt(req.params.id)
    );

    // Overwrite existing authors.json
    writeAuthors(currentAuthors);

    // Send response
    res.status(204).send();
    
  } catch (error) {
    next(error);
  }
})







export default authorsRouter;