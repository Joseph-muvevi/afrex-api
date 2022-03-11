const ErrorResponse = require("../utils/errorResponse");

const errorHandler = (err, req, res, next) => {
	let error = {}
	error.message = err.message

	if(err.code === 11000){
		const message = "Mongoose Duplication Error"
		error = new ErrorResponse(message, 500)
		console.log(err)
	}

	if(err.name === "ValidationError"){
		const message = Object.values(err.errors).map(error => error.message)
		error = new ErrorResponse(message, 400)
	}

	res.status(error.statusCode || 500).json({
		success: false,
		error: error.message || "Internal Server Error!!"
	})

}

module.exports = errorHandler