const express = require("express");
const router = express.Router();
const {postTask, getTask} = require("../controllers/task");

router.route("/post").post(postTask);
router.route("/all").get(getTask)

module.exports = router