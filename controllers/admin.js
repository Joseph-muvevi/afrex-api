
exports.adminpost = async (req, res, next) => {
	res.send("Admin route controller")
}


exports.adminget = async (req, res, next) => {
	res.status(200).send("Admin get request")
}