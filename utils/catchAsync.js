module.exports = (fn) => {
  return async (req, res, next) => {
    try {
      await fn(req, res, next);
    } catch (err) {
      //   console.log("the error got here catchasync ", err);
      next(err);
    }
  };
};
