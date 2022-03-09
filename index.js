// npm module imports
require("dotenv").config({path: "./config.env"});
const express = require("express");

// custom modules
const connectDB = require("./config/db");
const errorHandler = require("./middleware/error");

// running the imports
const app = express();
connectDB();

// middleware
app.use(express.json());
app.use("/api/admin", require("./routes/admin"));

// error ctaching middleware
app.use(errorHandler)

// port
const PORT = process.env.PORT || 7000
app.listen(PORT, () => console.log(`Connected to port: ${PORT}`));

// process termination
process.on("unhandledRejection", (reason, promise) => {
	console.log(`Unhandled Promise Rejection Error : ${reason}`)
	process.exit(1)
})
