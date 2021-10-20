import express from 'express';
import listEndpoints from 'express-list-endpoints';
import cors from 'cors';
import authorsRouter from './services/authors/index.js';
import blogPostsRouter from './services/blogPosts/index.js';
import { badRequestHandler, notFoundHandler, genericErrorHandler } from './errorHandlers.js';

const server = express();

// Global middleware
server.use(express.json());
server.use(cors()); // For later use.

server.use("/authors", authorsRouter);
server.use("/blogPosts", blogPostsRouter);

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
