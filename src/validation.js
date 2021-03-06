import { body } from 'express-validator';



export const authorPostValidation = [
  body("name").exists().isString().withMessage("First name is mandatory field"),
  body("surname").exists().isString().withMessage("Surname is mandatory field"),
  body("email").exists().isEmail().withMessage("Email is mandatory"),
  body("dateOfBirth").exists().isISO8601().withMessage("Date of birth is mandatory field, YYYY-MM-DD format"),
  body("avatar").exists().isURL().withMessage("Avatar link is mandatory")
];

/* 
name
surname
ID (Unique and server-generated)
email
date of birth
avatar (e.g. https://ui-avatars.com/api/?name=John+Doe)
*/




export const blogPostValidation = [
  body("category")
    .exists()
    .isString()
    .withMessage("Category is mandatory field"),
  body("title").exists().isString().withMessage("Title is mandatory field"),
  body("cover").optional().exists().isURL().withMessage("Cover is mandatory field"),
  body("email").exists().isEmail().withMessage("Email is mandatory field"),
  body("readTime")
    .exists()
    .withMessage("Read time is mandatory field")
    .isObject(),
  body("readTime.value")
    .exists()
    .isInt()
    .withMessage("Readtime value is mandatory field"),
  body("readTime.unit")
    .exists()
    .isString()
    .withMessage("Readtime unit is mandatory field"),
  body("author").exists().isObject().withMessage("Author is mandatory field"),
  body("author.name")
  .exists()
  .isString()
  .withMessage("Author name is mandatory"),
  body("author.avatar")
  .exists()
  .isURL()
  .withMessage("Author avatar is mandatory field"),
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