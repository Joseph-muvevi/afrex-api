require("dotenv").config({path : "./config.env"});

// package imports
const express = require("express");

// file imports
const connection = require("./database/db");
const errorsHandler = require("./middleware/error");

const app = express();

// database
connection()

// middleware
app.use(express.json())

// routes
app.use("/api/admin", require("./routes/admins"));
app.use("/api/users", require("./routes/users"));

// last middleware
app.use(errorsHandler)

// port
const PORT = process.env.PORT || 8000

const server = app.listen(PORT, () => console.log(`Running on port ${PORT}`))

// unhandles rejection termination
process.on("unhandledRejection", (err, promise) => {
	console.log(`Logged Error: ${err.message}`);
	server.close(() => process.exit(1));
});