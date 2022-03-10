const {postBlog} = require("../controllers/blogs");

const express = require("express");
const router = express.Router()

router.route("/post").post(postBlog)

module.exports = router