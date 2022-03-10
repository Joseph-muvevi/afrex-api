const ErrorResponse = require("../utils/errorResponse");
const Admin = require("../models/admin");
const sendEmail = require("../utils/sendEmail");
const crypto = require("crypto");

// admin registration route
exports.registerAdmin = async (req, res, next) => {
	const {firstName, lastName, country, city, position, telephone, email, password} = req.body

	try {

		const adminName = await Admin.findOne({ firstName, lastName })
		if(adminName){
			return next(new ErrorResponse("An admin with these names exists", 400))
		}

		const adminTelephone = await Admin.findOne({telephone})
		if(adminTelephone){
			return next(new ErrorResponse("An Admin with these credentials exists", 400))
		}

		const adminEmail = await Admin.findOne({email})
		if(adminEmail){
			return next(new ErrorResponse("An Admin with these credentials exists", 400))
		}

		const admin = await Admin.create({firstName, lastName, country, city, position, telephone, email, password})

		sendAdminToken(admin, 201, res)

	} catch (error) {
		next(error)
	}
}

// admin login route
exports.adminLogin = async (req, res, next) => {
	const {email, password} = req.body

	try {
		const admin = await Admin.findOne({email}).select("+password")

		if(!admin){
			return next(new ErrorResponse("Invalid Login Credentials", 404))
		}

		const matchPassword = await admin.comparePasswords(password)

		if(!matchPassword){
			return next(new ErrorResponse("Invalid Login Credentials", 400))
		}

		sendAdminToken(admin, 200, res)

	} catch (error) {
		next(error)
	}
}

// forgot password route
exports.adminForgotPassword = async (req, res, next) => {
	const {email} = req.body

	try {
		const admin = await Admin.findOne({email})

		if(!admin){
			return next(new ErrorResponse("Invalid Email", 404))
		}

		// generating the reset token
		const resetToken = admin.genResetToken()
		await admin.save()

		// the message section
		const resetUrl = `http://localhost:3000/passwordreset/${resetToken}`

		const message = `
			<h1>You have requested a password Reset</h1>
			<p>Please click to this link to reset your password, If you have not request for password reset please ignore this message.</p>
			<a href=${resetUrl} clicktracking=off>
				${resetUrl}
			</a>
		`

		// sending the email
		try {
			sendEmail({
				to: admin.email,
				subject: "Password Reset",
				text: message
			})

			res.status(200).json({
				success: true,
				data: "Email with the reset token was sent successfully"
			})
		} catch (error) {
			admin.resetPasswordToken = undefined
			admin.resetPasswordExpiry = undefined

			await admin.save()
			return next(new ErrorResponse("Something went wrong when sending the email", 500))
		}

	} catch (error) {
		next(error)
	}
}

// reset the password route
exports.adminResetPassword = async (req, res, next) => {
	const resetPasswordToken = crypto
		.createHash("sha256")
		.update(req.params.resetToken)
		.digest("hex")
	
	try {
		const admin = await Admin.findOne({
			resetPasswordToken,
			resetPasswordExpiry: {$gt : Date.now()}
		})

		if(!admin){
			return next(new ErrorResponse("Invalid Admin Token", 400))
		}

		admin.password = req.body.password

		admin.resetPasswordToken = undefined
		admin.resetPasswordExpiry = undefined

		await admin.save()

		res.status(200).json({
			success: true,
			data: "The password was updated successfully"
		})
	} catch (error) {
		next(error)
	}
}

// send token destructuring
const sendAdminToken = (admin, statusCode, res) => {
	token = admin.genAuthToken()

	res.status(statusCode).json({
		success: true,
		token
	})
}