import { body } from 'express-validator';

// How to continue the check of Object entries and their values?
// Validate within Author that name is string, avatar is an URL.
// Validate within readTime that value is numeric and unit is 'minute' and nothing else??



export const blogPostValidationMiddlewares = [
body("category").exists().withMessage("Category is mandatory field").isString(),
body("title").exists().withMessage("Title is mandatory field").isString(),
body("cover").exists().withMessage("Cover is mandatory field").isURL(),
body("readTime").exists().withMessage("Read time is mandatory field").isObject(),
body("author").exists().withMessage("Author is mandatory field").isObject(),
body("content").exists().withMessage("Content is mandatory field").isString(),
]


/* {	
"_id": "SERVER GENERATED ID",
"category": "ARTICLE CATEGORY",
"title": "ARTICLE TITLE",
"cover":"ARTICLE COVER (IMAGE LINK)",
"readTime": {
	"value": 2,
  "unit": "minute"
 },
"author": {
    "name": "AUTHOR AVATAR NAME",
    "avatar":"AUTHOR AVATAR LINK"
    },
 "content":"HTML",
 "createdAt": "NEW DATE"
} */