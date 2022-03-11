const Task = require("../models/task");

exports.postTask = async (req, res, next) => {
	const {assigner, assignee, title, content, dueDate, urgency, isCompleted} = req.body

	try {
		const task = await Task
			.create({assigner, assignee, title, content, dueDate, urgency, isCompleted})
			.sort({createdAt: "descending"})
			.populate({path: "assigner"})
			.populate({path: "assignee"})
	} catch (error) {
		next(error)
	}
}