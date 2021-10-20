import { body } from 'express-validator';



export const authorValidationMiddlewares = [

]

// How to continue the check of Object entries and their values?
// Validate within Author that name is string, avatar is an URL.
// Validate within readTime that value is numeric and unit is 'minute' and nothing else??

export const blogPostValidationMiddlewares = [
  body("category")
    .exists()
    .isString()
    .withMessage("Category is mandatory field"),
  body("title").exists().isString().withMessage("Title is mandatory field"),
  body("cover").exists().isURL().withMessage("Cover is mandatory field"),
  body("readTime")
    .exists()
    .withMessage("Read time is mandatory field")
    .isObject(),
  body("readTime.value")
    .exists()
    .isNumeric()
    .withMessage("Readtime value is mandatory field"),
  body("readTime.unit")
    .exists()
    .isString()
    .withMessage("Readtime unit is mandatory field"),
  body("author").exists().isObject().withMessage("Author is mandatory field"),
  body("author.name").exists().isString().withMessage("Author name is mandatory"),
  body("author.avatar").exists().isURL().withMessage("Author avatar is mandatory field"),
  body("content").exists().isString().withMessage("Content is mandatory field"),
];


/* {	
"_id": "SERVER GENERATED ID",
"category": "ARTICLE CATEGORY",€
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