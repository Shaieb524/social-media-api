import ErrorValidator from '../utils/error-validator'
import { Response } from "express";

export default class GeneralHelper {

    public static checkTryErrorTypeAndResponse(tryError: any, specificationMessage: string, res: Response) {
        if (tryError instanceof Error) 
            return res.status(ErrorValidator.INTERNAL_SERVER_ERROR).send(ErrorValidator.internalServerError(tryError.message))
        else 
            return res.status(ErrorValidator.INTERNAL_SERVER_ERROR).send(ErrorValidator.internalServerError(specificationMessage))
    }
}