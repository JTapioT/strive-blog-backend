import express from 'express';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const authorsRouter = express.Router();

const currentFilePath = fileURLToPath(import.meta.url);
const parentFolderPath = dirname(currentFilePath);
// Managed to understand relative path somehow. Now I can have authors.json within separate 'data' -folder.
const authorsJSONPath = join(parentFolderPath, "../../data/authors.json");



// Return list of all authors - GET
authorsRouter.get("/", (req,res) => {
  // Get authors, [{},{}..]
  const authors = JSON.parse(fs.readFileSync(authorsJSONPath));
  res.send(authors);
})



// Return a single author by id - GET
// I need to use parseInt() since existing author.id is in a string form??.
authorsRouter.get("/:id", (req,res) => {
  // Read authors.json
  const authors = JSON.parse(fs.readFileSync(authorsJSONPath));

  // Find author from authors by id which is provided with request params
  const author = authors.find(author => author.id === parseInt(req.params.id));

  // Send response
  res.send(author);
})



// Create a new author - POST
// Should here happen the validation that req.body has information what is needed?? - Reject if body does not contain necessary info etc..?
authorsRouter.post("/", (req,res) => {
  // Read authors.json
  const authors = JSON.parse(fs.readFileSync(authorsJSONPath));

  // Create new author - add random id
  let newAuthor = {...req.body, id: Date.now()};

  // Push new author to existing authors array
  authors.push(newAuthor);

  // Overwrite existing authors.json
  fs.writeFileSync(authorsJSONPath, JSON.stringify(authors));

  // Send response
  res.status(201).send({id: newAuthor.id});
})




// Edit the author with the given id - PUT
authorsRouter.put("/:id", (req,res) => {
  // Read authors.json
  const authors = JSON.parse(fs.readFileSync(authorsJSONPath));

  // Find index of an author within authors:
  let index = authors.findIndex(author => author.id === parseInt(req.params.id))
  
  // Modify the existing author
  let editedAuthor = {...authors[index], ...req.body};
  authors[index] = editedAuthor;

  // Overwrite authors.json
  fs.writeFileSync(authorsJSONPath, JSON.stringify(authors));

  // Send response
  res.status(200).send(editedAuthor);
})




// Delete the author by id - DELETE
authorsRouter.delete("/:id", (req,res) => {
  // Read authors.json
  const authors = JSON.parse(fs.readFileSync(authorsJSONPath));

  // Filter out the author from authors
  let currentAuthors = authors.filter(author => author.id !== parseInt(req.params.id));

  // Overwrite existing authors.json
  fs.writeFileSync(authorsJSONPath, JSON.stringify(currentAuthors));

  // Send response
  res.status(204).send();
})







export default authorsRouter;