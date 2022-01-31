const User = require("../models/user")
const ErrorResponse = require("../utils/errorResponse")

// registration 
exports.userregister = async (req, res, next) => {
	const {username, email, password} = req.body

	try {
		const user = await User.create({username, email, password})

		sendToken(user, 201, res)
	} catch (error) {
		next(error)
	}

}

// login
exports.userlogin = async  (req, res, next) => {
	const {email, password} = req.body

	try {
		if (!email && !password) {
			return next(new ErrorResponse("Invalid credentials", 400))
		}

		const user = await User.findOne({email}).select("+password");
		if (!user) {
			return next(new ErrorResponse("Not authorized", 401))
		}

		const isMatch = user.comparePassword(password)

		if (!isMatch) {
			return next(new ErrorResponse("Invalid credentials", 400))
		}

		sendToken(user, 200, res)		

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

// refactoring sending token function
const sendToken = (user, statusCode, res) => {
	const token = user.genSignToken()

	res.status(statusCode).json({
		success: true,
		token
	})
}