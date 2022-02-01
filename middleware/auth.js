const ErrorResponse = require("../utils/errorResponse");
const jwt = require("jsonwebtoken");
const User = require("../models/user");

exports.protectUser = async (req, res, next) => {
	let token;

	if (
		req.headers.authorization && 
		req.headers.authorization.startsWith("Bearer")
	){
		token = req.headers.authorization.split(" ")[1]
	}

	if (!token){
		return next(new ErrorResponse("Not Authorized", 401))
	}

	try {
		const decoded = jwt.verify(token, process.env.JWT_SECRET)

		const user = await User.findById(decoded.id)

		if(!user) {
			return next(new ErrorResponse("Invalid token", 400))
		}

		req.user = user
		next()

	} catch (error) {
		return next(new ErrorResponse("Not authorized", 500))
	}
}