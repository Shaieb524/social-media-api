const nodemailer = require("nodemailer");

const sendEmail = async (email, subject, text) => {
    try {
        let testAccount = await nodemailer.createTestAccount();
        const transporter = nodemailer.createTransport({
            service: "hotmail",            
            port: 587,
            secure: false,
            auth: {
                user: "kparth2010@outlook.com", // generated ethereal user
                pass: "Aa11111!", // generated ethereal password
            },
        });

        await transporter.sendMail({
            from: "kparth2010@outlook.com",
            to: email,
            subject: subject,
            text: text,
        });

        console.log("email sent sucessfully");
    } catch (error) {
        console.log(error, "email not sent");
    }
};

module.exports = sendEmail;
