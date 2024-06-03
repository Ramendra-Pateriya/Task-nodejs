
import nodemailer from 'nodemailer';
import { configDotenv } from 'dotenv';
configDotenv();

//send account confirmation email
const sendEmail = (resetPasswordLink, user_mail)=>{
    var transport = nodemailer.createTransport({
        service: 'gmail',
        auth:{
            user: process.env.USER_EMAIL,
            pass: process.env.USER_EMAIL_PASSWORD
        }
    });

     // Setup email data
    var mailOptions = {
        from: process.env.USER_EMAIL,
        to: `${user_mail}`,
        subject: 'Reset Password',
        html: `This link valid for 5 minute . <br> Click <a href="${resetPasswordLink}">here</a> to reset your password.`
    }
    
    transport.sendMail(mailOptions, (err, info)=>{
        if(err) throw err;
        res.status(200).json({ message: 'Reset password email sent successfully' });
    });
}


export default sendEmail;