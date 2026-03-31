class apiResponse {
    constructor(
        statusCode,
        data,
        msg,
        success = true,
    ) {
        this.statusCode = statusCode,
            this.data = data,
            this.msg = msg,
            this.success = success < 400
    }
}

export default apiResponse