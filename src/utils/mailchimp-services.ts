import { MANDRILL_KEY } from '../constants/constants'
const mandrill = require('node-mandrill')(MANDRILL_KEY);

export class MailChimpServices {

    public mailSender(senderMail : string, receiverMail: string, mailSubject: string, mailMainBody: string) {
        mandrill('/messages/send', {
            message: {
                to: [{email: `${receiverMail}`}],
                from_email: `${senderMail}`,
                subject: `${mailSubject}`,
                text: `${mailMainBody}`
            }
        }, function(error : any, response : any)
        {
            if (error) console.log( JSON.stringify(error) );
            else console.log(response);
        });
    }
}
