const ErrorResponse = require('../utils/errorResponse');

const errorHandler = (err, req, res, next) => {
    let error = { ...err };

    error.message = err.message;

    // Log to console for dev
    console.log(err);

    // Mongoose bad objectID
    if (err.name === 'CastError') {
        const message = 'Resource not found';
        error = new ErrorResponse(message, 404);
    }

    //Mongoose Duplicate key
    if (err.code === 11000) {
        const message = 'Duplicate field value entered';

        error = new ErrorResponse(message, 400);
    }


    // Mongoose validation error
    if (err.name === 'ValidatorError') {
        const message = Object.values(err.error).map(val => val.message);

        error = new ErrorResponse(message, 400);
    }

    res.status(error.statusCode || 500).json({
        success: false,
        error: error.message || 'Server Error'
    });
};

module.exports = errorHandler;