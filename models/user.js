const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// the user schema
const UserSchema = new mongoose.Schema({
	username: {
		type: String,
		required: [true, "Please provide a username"],
		minlength: [3, "The minimum character allowed is 3"],
		maxlength: [20, "The minimum character allowed is 20"],
	},
	email: {
		type: String,
		unique: true,
		match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please provide a valid email address'],
		required: [true, "Please provide an email address"],
		minlength: [3, "The minimum character allowed is 3"],
		maxlength: [20, "The minimum character allowed is 20"],
	},
	password: {
		type: String,
		required: true,
		minlength: [6, "The minimum character allowed is 6"]
	},
	resetPasswordToken : String,
	resetPasswordExpiry: Date
})

// encrypting the password
UserSchema.pre("save", async function (next){
	if(!this.isModified("password")){
		next()
	}

	const salt = await bcrypt.genSalt(10)
	this.password = await bcrypt.hash(this.password, salt)
	next()
})

// comparing password method
UserSchema.methods.comparePassword = async function(password){
	return await bcrypt.compare(password, this.password)
}

// generating user json web token
UserSchema.methods.genSignToken = function(){
	return jwt.sign({id: this._id}, process.env.JWT_SECRET, {
		expiresIn: process.env.JWT_EXPIRY
	})
}

// generating reset passwrd token
UserSchema.methods.genResetToken = function (){
	const resetToken = crypto.randomBytes(20).toString("hex");

	// hashing the made up token
	this.resetPasswordToken = crypto
		.createHash("sha256")
		.update(resetToken)
		.digest("hex")
	
	// dealing with token expiry
	this.resetPasswordExpiry = Date.now() + 15*(60*1000)
	
	return resetToken
}

// the user model
const User = mongoose.model("User", UserSchema);


// exports
module.exports = User;
// module.exports = UserSchema;