/**
 * Global error handling middleware
 * Should be added last in the middleware chain
 */
const errorHandler = (err, req, res, next) => {
    // Log error for debugging
    console.error('Error:', {
        message: err.message,
        stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
        path: req.path,
        method: req.method
    });

    // Default error status
    const statusCode = err.statusCode || err.status || 500;

    // Prepare error response
    const errorResponse = {
        error: err.message || 'Internal server error',
        path: req.path
    };

    // Include stack trace in development
    if (process.env.NODE_ENV === 'development') {
        errorResponse.stack = err.stack;
    }

    // Handle specific error types
    if (err.name === 'ValidationError') {
        return res.status(400).json({
            error: 'Validation failed',
            details: err.details || err.message
        });
    }

    if (err.name === 'UnauthorizedError') {
        return res.status(401).json({
            error: 'Unauthorized',
            message: err.message
        });
    }

    if (err.code === '23505') { // PostgreSQL unique constraint violation
        return res.status(409).json({
            error: 'Duplicate entry',
            message: 'Resource already exists'
        });
    }

    if (err.code === '23503') { // PostgreSQL foreign key violation
        return res.status(400).json({
            error: 'Invalid reference',
            message: 'Referenced resource does not exist'
        });
    }

    // Send error response
    res.status(statusCode).json(errorResponse);
};

/**
 * 404 Not Found handler
 */
const notFoundHandler = (req, res) => {
    res.status(404).json({
        error: 'Not found',
        path: req.path,
        message: `Route ${req.method} ${req.path} not found`
    });
};

/**
 * Async route handler wrapper to catch errors
 */
const asyncHandler = (fn) => {
    return (req, res, next) => {
        Promise.resolve(fn(req, res, next)).catch(next);
    };
};

module.exports = {
    errorHandler,
    notFoundHandler,
    asyncHandler
};
