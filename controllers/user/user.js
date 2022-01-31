const User = require("../../models/user")

exports.userpost = async (req, res, next) => {
	const {username, email, password} = req.body

	try {
		const user = await User.create({username, email, password})

		res.status(201).json({
			success: true,
			user
		})
	} catch (error) {
		next(error)
	}

}


exports.userget = async (req, res, next) => {

	try {
		const users = await User.find().sort()
		res.status(200).json({
			success: true,
			users
		})
	} catch (error) {
		next(error)
	}
}