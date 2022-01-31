const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

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

// the user model
const User = mongoose.model("User", UserSchema);


// exports
module.exports = User;
// module.exports = UserSchema;