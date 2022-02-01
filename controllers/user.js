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

// get all users
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

// forgot user password
exports.forgotPassword = async (req, res, next) => {
	const {email} = req.body
	
	try {
		const user = await User.findOne({email})

		if(!user) {
			return next(new ErrorResponse("Email could not be send", 400))
		}

		const resetToken = user.genResetToken()
		user.save()

		// the reset token link
		const resetUrl = `http://localhost:5001/passwordreset/${resetToken}`

		// the inbox message
		const message = `
			<h2>You requested a password reset</h2>
			<p>You have requested a password reset If you have not please ignore. </p>
			<p>Click the link below to reset your password. </p>
			<a href=${resetUrl} clicktracking=off>${resetUrl}</a>
		`

	} catch (error) {
		
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