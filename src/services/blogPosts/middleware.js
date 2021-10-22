import multer from "multer";

export function singleFileHandler(key) {
  multer().single(key);
}

export function multipleFileHandler(key) {
  // ??
}

// Is this even needed... In a way would make 
// Maybe taking it too far with this re-factoring.