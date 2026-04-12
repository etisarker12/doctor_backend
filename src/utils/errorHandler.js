// Global error handler middleware stub
const errorHandler = (err, req, res, next) => {
  // TODO: Implement proper error handling in later phases
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Internal Server Error'
  });
};

module.exports = errorHandler;