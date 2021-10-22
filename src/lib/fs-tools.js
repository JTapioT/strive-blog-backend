import fs from 'fs-extra';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const { readJSON, writeJSON, writeFile } = fs; 

// Public folder path - serve static files
//const publicFolderPath = join(process.cwd(), "./public/");
const authorImgFolderPath = join(process.cwd(), "./public/img/authors");
const blogImgFolderPath = join(process.cwd(), "./public/img/blogPosts");

// Folder paths for JSON files
const dataFolderPath = join(dirname(fileURLToPath(import.meta.url)), "../data");
const authorsJSONPath = join(dataFolderPath, "authors.json");
const blogPostsJSONPath = join(dataFolderPath, "blogPosts.json");

// Functions related to retrieving and writing JSON files from different paths
// Get authors.json
export function getAuthorsJSON() {
  return readJSON(booksJSONPath);
}
// Write authors.json
export function writeAuthorsJSON(content) {
  return writeJSON(authorsJSONPath, content);
}
// Get blogPosts.json
export function getBlogPostsJSON() {
  return readJSON(blogPostsJSONPath);
}
// Write blogPosts.json
export function writeBlogPostsJSON(content) {
  return writeJSON(blogPostsJSONPath, content);
}


// SAVE STATIC FILES
// Save avatar images
export function saveAvatarImages(filename, content) {
  return writeFile(join(authorImgFolderPath, filename), content);
}
// Save cover images
export function saveCoverImages(filename, content) {
  return writeFile(join(blogImgFolderPath, filename), content);
}

