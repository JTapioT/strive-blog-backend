import express from 'express';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
// import uniqid from 'uniqid'


const authorsRouter = express.Router();

const currentFilePath = fileURLToPath(import.meta.url); // Current file path, file included within the path
const parentFolderPath = dirname(currentFilePath); // Parent folder path
// Managed to understand relative path somehow. Now I can have authors.json within separate 'data' -folder.
const authorsJSONPath = join(parentFolderPath, "../../data/authors.json");

// const authorsJSONPath = join(dirname(fileURLToPath(import.meta.url)), "../../data/authors.json")

// Concise functions:
// const getAuthors = () => JSON.parse(fs.readFileSync(authorsJSONPath))
// const writeAuthors = (content) => fs.writeFileSync(authorsJSONPath, JSON.stringify(content))

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
  let newAuthor = {
    ...req.body,
    id: Date.now(), // uniqid()
    avatar: `https://ui-avatars.com/api/?name=${req.body.name}+${req.body.surname}`,
    createdAt: new Date()
  };

  // Push new author to existing authors array
  authors.push(newAuthor);

  // Overwrite existing authors.json
  fs.writeFileSync(authorsJSONPath, JSON.stringify(authors));

  // Send response
  res.status(201).send({id: newAuthor.id});
})

// EXTRA
// Check that same e-mail does not exist already.
authorsRouter.post("/checkEmail", (req,res) => {
  // Read authors.json
  const authors = JSON.parse(fs.readFileSync(authorsJSONPath));

  let response = authors.findIndex((author) => author.email.toLowerCase() === req.body.email.toLowerCase()) === undefined ? false : true

  // Is this even valid in any way to just send boolean value as a response??
  res.status(200).send({"value": response});

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