import express from 'express';
import listEndpoints from 'express-list-endpoints';
import cors from 'cors';
import authorsRouter from './services/authors/index.js';

const server = express();

server.use(express.json());
server.use(cors()); // For later use.
server.use("/authors", authorsRouter);

const PORT = 3001;
console.table(listEndpoints(server));

server.listen(PORT, () => {
  console.log("Server is running on port:", PORT);
});

export default server;
