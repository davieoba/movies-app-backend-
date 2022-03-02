require("dotenv").config({
  path: "./../.env",
});

// so error has the following properties on them (message, status, statusCode, isOperational and stacktrace)
const sendErrorDev = (err, req, res) => {
  let status = err.status || "fail";
  let statusCode = err.statusCode || "500";

  res.status(statusCode).json({
    status: status,
    error: err,
    message: err.message,
    stackTrace: err.stack,
  });
};

module.exports = (err, req, res, next) => {
  if (process.env.NODE_ENV === "development") {
    sendErrorDev(err, req, res);
  } else if (process.env.NODE_ENV === "production") {
    sendErrorProd(err, req, res);
  }
};
