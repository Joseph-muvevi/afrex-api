const Task = require("../models/task");

// post task
exports.postTask = async (req, res, next) => {
	const {assigner, assignee, title, content, dueDate, priority, isCompleted} = req.body

	try {
		const task = await Task.create({assigner, assignee, title, content, dueDate, priority, isCompleted})


		res.status(201).json({
			success: true,
			data: task
		})
	} catch (error) {
		next(error)
	}
}

exports.getTask = async (req, res, next) => {
	try {
		const allTasks = await Task
			.find({})
			.sort({createdAt: "descending"})
			.populate({path: "assigner"})
			.populate({path: "assignee"})
		
		res.status(200).json({
			success: true,
			data: allTasks
		})
	} catch (error) {
		next(error)
	}

}