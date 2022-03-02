const express = require("express");
const cors = require("cors");
const movieRouter = require("./routes/movie-routes");
const userRouter = require("./routes/user-routes");
const reviewRouter = require("./routes/review-routes");
const AppError = require("./utils/app-error");
const globalErrorController = require("./controllers/error-controller");

const app = express();
app.use(express.json());
app.use(cors());

app.use("/api/v1/movies", movieRouter);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/reviews", reviewRouter);

app.all("*", (req, res, next) => {
  next(new AppError("this route does not exist", "404"));
});

app.use(globalErrorController);
module.exports = app;
