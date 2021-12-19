import CustomLogger from './custom-logger'

export default class ErrorValidator {

    static SUCCESS = 200;
    static BAD_REQUEST = 400;
    static UNAUTHORIZED = 401;
    static FORBIDDEN = 403;
    static NOT_FOUND = 404;
    static METHOD_NOT_ALLOWED = 405;
    static INTERNAL_SERVER_ERROR = 500;

    static success() {
        return {
            code: this.SUCCESS,
            message: "Successful",
            status: "success",
            data: {}
        }
    }

    static badRequest(message? : string) {
        CustomLogger.logger.error(`${message}`);
        return {
            code: this.BAD_REQUEST,
            message: "Bad Request!",
            status: "fail",
            data: {}
        }
    }

    static unauthorized() {
        return {
            code: this.UNAUTHORIZED,
            message: "Unauthorized User",
            status: "fail",
            data: {}
        }
    }

    static forbidden(message? : string) {
        CustomLogger.logger.error(`${message}`);
        return {
            code: this.FORBIDDEN,
            message: "Forbidden",
            status: "fail",
            data: {}
        }
    }

    static notFound(message? : string) {
        CustomLogger.logger.error(`${message}`);
        return {
            code: this.NOT_FOUND,
            message: "Not found!",
            status: "fail",
            data: {}
        }
    }

    static methodNotAllowed() {
        return {
            code: this.METHOD_NOT_ALLOWED,
            message: "Request Method not allowed",
            status: "fail",
            data: {}
        }
    }

    static internalServerError(message? : string) {
        CustomLogger.logger.error(`${message}`);
        return {
            code: this.INTERNAL_SERVER_ERROR,
            message: 'Internal server error, please contact support team! ',
            status: "fail",
            data: {}
        }
    }

}