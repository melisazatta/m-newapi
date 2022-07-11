const { validatorCreatePost } = require("../validators/posts");
const { createPost, searchTitleByText, getAllPosts, getPostById, updatePost, deletePost } = require("./postController")
const router = require("express").Router()
const fileUpload = require("../utils/handleStorage")
const isAuth = require("../utils/isAuth")


router.post("/", fileUpload.single("file")/*, isAuth*/, validatorCreatePost, createPost);
router.get("/find/:query", searchTitleByText);
router.get("/", getAllPosts)
router.get("/:id", getPostById)
router.patch("/:id",fileUpload.single("file"), isAuth, updatePost)
router.delete("/:id", deletePost)

module.exports = router