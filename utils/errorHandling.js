// A generic function that is going to respond with the status of the error, wheter it's a 404, or 500 (Server problem)
exports.errorHandler = (error, req, res, next) => {
    return res.status(error.status || 500).json({
        error: {
            message: error.message || "Oops! Something went wrong"
        }
    });
}