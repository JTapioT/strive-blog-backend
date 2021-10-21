import express from 'express';
import listEndpoints from 'express-list-endpoints';
import cors from 'cors';
import authorsRouter from './services/authors/index.js';
import blogPostsRouter from './services/blogPosts/index.js';
import { badRequestHandler, notFoundHandler, genericErrorHandler } from './errorHandlers.js';
import {join} from 'path';

// Public folder path - static files
const publicFolderPath = join(process.cwd(), "./public");
const authorImagesFolderPath = join(process.cwd(), "./public/img/authors");
const blogImagesFolderPath = join(process.cwd(), "./public/img/blogPosts")


// Invoke function express() - Object returned with many methods to use.
const server = express();

// Global middleware
//server.use(express.static(publicFolderPath));
server.use(cors()); // Next week, deep dive to CORS!
server.use(express.json());

// Endpoints
server.use("/authors", authorsRouter);
server.use("/blogPosts", blogPostsRouter);
// Woah, exceeding even my own expectations about what I can do by reading from inter-webs:
// Serve static files from endpoint /authorImages:
server.use("/authorImages", express.static(authorImagesFolderPath));
// Serve static files from endpoint /blogImages:
server.use("/blogImages", express.static(blogImagesFolderPath))

// Error handling middleware
server.use(badRequestHandler);
server.use(notFoundHandler);
server.use(genericErrorHandler);


const PORT = 3001;
console.table(listEndpoints(server));

server.listen(PORT, () => {
  console.log("Server is running on port:", PORT);
});

export default server;
