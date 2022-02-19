import { Request, Response, Router } from "express";
import ErrorValidator from '../utils/error-validator'
import GeneralHelper from '../utils/general-helper'
import MailChimpServices from '../utils/mailchimp-services'
import MainController from './main'

export default class ServicesController {
    public router = Router()
    
    constructor() {
        this.router.route("/send-email").post(this.sendEmail);
    }

    public sendEmail = async (req: Request, res: Response) => {
        await MailChimpServices.mailSender(req.body.mailSender, req.body.mailReceiver, req.body.mailTitle, req.body.mailBody)
        
        res.status(ErrorValidator.SUCCESS).send({message : "Email is sent!"})
    }
}