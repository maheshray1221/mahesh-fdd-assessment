class apiError extends Error {
    constructor(
        statusCode,
        msg = "somthing went wrong",
        errors = [],
        stack = ""
    ) {
        super(msg),
        this.statusCode = statusCode,
        this.data = null,
        this.msg = msg,
        this.success = false,
        this.errors = errors

        // only for production  
        if (stack) {
            this.stack = stack
        } else {
            Error.captureStackTrace(this, this.constructor)
        }
    }
}

export default apiError