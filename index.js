require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const pool = require("./db_connection/db_connection.js"); // Import the connection pool
const studentRoute = require("./routes/studentRoute.js");
const userRoute = require("./routes/userRoute.js");

const app = express();

// Your application code goes here...
// For example, set up your Express app and routes.

// ... Your Express middleware, routes, and other configurations ...
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());
// Start the server
const port = process.env.PORT || 3000;

app.use((err, req, res, next) => {
  if (err instanceof SyntaxError && err.status === 400 && "body" in err) {
    // Handle JSON parsing error caused by invalid JSON data
    return res
      .status(400)
      .json({ message: "Invalid JSON data in the request body." });
  }

  // For other types of errors, you can define additional error handling logic
  // For example, you can return a 500 error for server-side errors

  return next(err); // If the error is not handled here, pass it to the next error handler
});

// Use the connection pool to connect to the database
(async () => {
  try {
    // Get a connection from the pool
    const connection = await pool.getConnection();

    // Release the connection after successful connection
    connection.release();

    // Listen on the specified port
    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  } catch (err) {
    console.error("Error connecting to the database:", err.message);
  }
})();

app.use("/api/v1/students", studentRoute);
app.use("/api/v1/users", userRoute);
