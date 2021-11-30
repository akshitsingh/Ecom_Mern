const nodeMailer = require('nodemailer');

SMTP_SERVICE = 'gmail'
SMTP_MAIL = 'tempmailfor6pp@gmail.com',
SMTP_PASSWORD = 'pleasesubscribe'


const sendEmail = async(options)=>{

    const transporter = nodeMailer.createTransport({
        // host : 'smtp.gmail.com',
        // port : 465,
        service : SMTP_SERVICE,
        auth  : {
            user : SMTP_MAIL,
            password : SMTP_PASSWORD
        }
    })

    const mailOptions = {
        from : SMTP_MAIL,
        to : options.email,
        subject : options.subject,
        text : options.message
    }

   await transporter.sendMail(mailOptions)
} 

module.exports = sendEmail;