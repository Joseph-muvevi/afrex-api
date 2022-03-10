const mongoose = require("mongoose");

// paragraph schema
const ImageSchema = new mongoose.Schema({
	description: {
		type: String,
		trim: true,
		minlength: [5, "The minimum allowed characters is 5"],
		maxlength: [100, "The minimum allowed characters is 100"],
	},
	source: {
		type: String,
		trim: true,
		maxlength: [1000, "The minimum allowed characters is 1000"],
		required: [true, "Please add a paragraph"]
	}
})

// paragraph schema
const ParagraphSchema = new mongoose.Schema({
	topic: {
		type: String,
		trim: true,
		minlength: [5, "The minimum allowed characters is 5"],
		maxlength: [100, "The minimum allowed characters is 100"],
	},
	paragraph: {
		type: String,
		trim: true,
		minlength: [20, "The minimum allowed characters is 20"],
		maxlength: [1000, "The minimum allowed characters is 1000"],
		unique: [true, "The paragraphs have to be unique"],
		required: [true, "Please add a paragraph"]
	}
})

// list schema
const ListSchema = new mongoose.Schema({
	topic: {
		type: String,
		trim: true,
		minlength: [5, "The minimum allowed characters is 5"],
		maxlength: [100, "The minimum allowed characters is 100"],
	},
	lists: {
		type: Array,
		trim: true,
		minlength: [20, "The minimum allowed characters is 20"],
		maxlength: [1000, "The minimum allowed characters is 1000"],
		required: [true, "Please add a paragraph"],
		unique: [true, "The lists have to be unique"],
	}
})

// blog schema
const BlogSchema = new mongoose.Schema({
	author: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "user",
		required: [true, "Please enter the name of the blog's author"]
	},
	title: {
		type: String,
		trim: true,
		unique: [true, "Title has to be unique"],
		minlength: [5, "The minimum allowed characters is 5"],
		maxlength: [100, "The minimum allowed characters is 100"],
	},
	images: {
		type: [ImageSchema],
		min: [1, "The minimum allowed image is one"],
		max: [10, "The maximum allowed images are ten"],
		required: true
	},
	paragraphBlock: {
		type: [ParagraphSchema],
		min: [1, "The minimum allowed paragraph block is one"],
		max: [10, "The maximum allowed paragraph blocks are ten"],
	},
	listBlock: {
		type: [ListSchema],
		min: [1, "The minimum allowed list block is one"],
		max: [10, "The maximum allowed list blocks are ten"],
	},
	tags: {
		type: Array,
		min: [1, "The minimum allowed tag is one"],
		max: [10, "The maximum allowed tags are ten"],
		required: true
	},
}, {timestamps: true})

// the model
const Blog = mongoose.model("blogs", BlogSchema)
module.exports = Blog