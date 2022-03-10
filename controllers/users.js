const ErrorResponse = require("../utils/errorResponse");
const User = require("../models/users");
const sendEmail = require("../utils/sendEmail");
const crypto = require("crypto");

// registering a user
exports.registerUser = async (req, res, next) => {
    const {firstName, lastName, country, city, position, telephone, email, password} = req.body

	try {

		const usersName = await User.findOne({ firstName, lastName })
		if(usersName){
			return next(new ErrorResponse("A User with these names exists", 400))
		}

		const userTelephone = await User.findOne({telephone})
		if(userTelephone){
			return next(new ErrorResponse("A User with these credentials exists", 400))
		}

		const userEmail = await User.findOne({email})
		if(userEmail){
			return next(new ErrorResponse("A User with these credentials exists", 400))
		}

		const user = await User.create({firstName, lastName, country, city, position, telephone, email, password})

		sendUserToken(user, 201, res)

	} catch (error) {
		next(error)
	}
}

// authenticating the user
exports.userLogin = async (req, res, next) => {
	const {email, password} = req.body

	try {
		const user = await User.findOne({email}).select("+password")

		if(!user){
			return next(new ErrorResponse("Invalid Login Credentials", 404))
		}

		const matchPasswords = await user.comparePasswords(password)

		if(!matchPasswords){
			return next(new ErrorResponse("Invalid Login Credentials", 400))
		}

		sendUserToken(user, 200, res)

	} catch (error) {
		next(error)
	}
}

// forgot password
exports.userForgotPassword = async (req, res, next) => {
	const {email} = req.body

	try {
		const user = await User.findOne({email})

		if(!user){
			return next(new ErrorResponse("Invalid email", 404))
		}

		const resetToken = user.genUserResetToken()
		await user.save()

		
		// the message section
		const resetUrl = `http://localhost:3000/passwordreset/${resetToken}`

		const message = `
			<h1>You have requested a password Reset</h1>
			<p>Please click to this link to reset your password, If you have not request for password reset please ignore this message.</p>
			<a href=${resetUrl} clicktracking=off>
				${resetUrl}
			</a>
		`

		try {
			sendEmail({
				to: user.email,
				subject: "Password Reset",
				text: message
			})

			res.status(200).json({
				success: true,
				data: "Email with the reset token was sent successfully"
			})
		} catch (error) {
			user.resetPasswordToken = undefined
			user.resetPasswordExpiry = undefined

			await user.save()
			
			await admin.save()
			return next(new ErrorResponse("Something went wrong when sending the email", 500))
		}

	} catch (error) {
		next(error)
	}
}

// reset the password
exports.userResetPassword  = async (req, res, next) => {
	const resetPasswordToken = crypto
		.createHash("sha256")
		.update(req.params.resetToken)
		.digest("hex")
	
	try {
		const user = await User.findOne({
			resetPasswordToken,
			resetPasswordExpiry: {$gt : Date.now()}
		})

		if(!user){
			return next(new ErrorResponse("Invalid Admin Token", 400))
		}

		user.password = req.body.password

		user.resetPasswordToken = undefined
		user.resetPasswordExpiry = undefined

		await user.save()

		res.status(200).json({
			success: true,
			data: "The password was updated successfully"
		})
		
	} catch (error) {
		next(error)
	}
}

// refactoring sending token mothod
const sendUserToken = (user, statusCode, res) => {
    token = user.genUserToken()

	res.status(statusCode).json({
		success: true,
		token
	})
}