const mongoose = require("mongoose");

const TaskSchema = new mongoose.Schema({
	assigner: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "admin"
	},
	assignee: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "user",
		required: [true, "Please add to whom you are assigning task to"]
	},
	title: {
		type: String,
		minlength: [5, "The task title should have a minimum of five characters"],
		maxlength: [100, "The task title should not exceed  one hundred characters"],
		required: [true, "Please add the task's title"]
	},
	content: {
		type: String,
		minlength: [20, "The task title should have a minimum of twenty characters"],
		maxlength: [500, "The task content should not exceed  five hundred characters"],
		required: [true, "Please add the task's content information"]
	},
	dueDate: {
		type: String,
		minlength: [5, "The task date should have a minimum of five characters"],
		maxlength: [100, "The task date should not exceed  one hundred characters"],
		required: [true, "Please add the task's due date"]
	},
	urgency: {
		type: String,
		minlength: [5, "The task urgency field should have a minimum of five characters"],
		maxlength: [100, "The task urgency field should not exceed  one hundred characters"],
	},
	isCompleted: {
		type: Boolean,
	}
}, {timestamps: true})


// the model
const Task = mongoose.model("Task", TaskSchema)
module.exports = Task