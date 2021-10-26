import express from 'express';
import { authorPostValidation } from '../../validation.js';
import multer from 'multer';
import { getAuthors, getAuthorById, uploadAvatarImage, checkForAlreadyExistingEmail, newAuthor, editAuthor, deleteAuthor } from './requestHandlers.js';

// Router
const authorsRouter = express.Router();

// Return list of all authors - GET
authorsRouter.get("/", getAuthors);

// Return a single author by id - GET
authorsRouter.get("/:id", getAuthorById);

// Create a new author - POST
authorsRouter.post("/", authorPostValidation, newAuthor)

// Upload author avatar image - POST
authorsRouter.post("/:id/uploadAvatar", multer().single("avatar"), uploadAvatarImage)

// Check that same e-mail does not exist already - POST
authorsRouter.post("/checkEmail", checkForAlreadyExistingEmail)

// Edit the author with the given id - PUT
authorsRouter.put("/:id", editAuthor)

// Delete the author by id - DELETE
authorsRouter.delete("/:id", deleteAuthor)


export default authorsRouter;