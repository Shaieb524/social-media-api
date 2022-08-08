import CustomLogger from './custom-logger'
import { MANDRILL_KEY } from '../constants/constants'
const mandrill = require('node-mandrill')(MANDRILL_KEY);

export default class MailChimpServices {

    public static mailSender(senderMail : string, receiverMail: string, mailSubject: string, mailMainBody: string) {
        mandrill('/messages/send', {
            message: {
                to: [{email: `${receiverMail}`}],
                from_email: `${senderMail}`,
                subject: `${mailSubject}`,
                text: `${mailMainBody}`
            }
        }, function(error : any, response : any)
        {
            if (error) {
                CustomLogger.logger.error(JSON.stringify(error));
            } else {
                CustomLogger.logger.info(response);
            }
        });
    }
}


