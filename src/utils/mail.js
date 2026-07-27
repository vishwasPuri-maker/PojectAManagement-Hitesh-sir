import Mailgen from "mailgen";
import nodemailer from "nodemailer"

/**
 * 
 * For sending the email we have to write always this to isliye ek baar likh liya to baar baar likhne ki jarrorat nhi hai  
 */

const sendEmail = async (options)=>{
    const mailGenrator = new Mailgen({
        theme : "default",
        product:{
            name : "Task Manager",
            link : "https://taskmanagelink.com"
        }
    })

    const emailTextual = mailGenrator.generatePlaintext(options.mailgenContent)
    const emailHTML = mailGenrator.generate(options.mailgenContent)

    const transporter = nodemailer.createTransport({
        host : process.env.MAILTRAP_SMTP_HOST,
        port : process.env.MAILTRAP_SMTP_PORT,
        auth : {
            user : process.env.MAIL_TRAP_USER,
            pass : process.env.MAIL_TRAP_SMTP_PASS
        }
    })
    const mail = {
        from : "mail.taskmanager@example.com",
        to : options.email,
        subject : options.subject,
        text : emailTextual,
        html : emailHTML
    }
    try {
        await transporter.sendMail(mail)
    } catch (error) {
        console.error(" Email service failed silently make sure that you have provided your MAILTRAP credentials in the .env file ")
        console.log(error)
    }
}

const emailverificationGeneratorContent = (userName, verificationUrl) => {
    return {
        body : {
            name : userName,
            intro : "Welciome to Project Management App! We're very excited to have you on board.",
            action : {
                intruction : "To get started with your account, take a look of that",
                button : {
                    color : "#1f1e1e00",
                    text : "Verify your email",
                    link : verificationUrl
                }
            },
            outro : "Need help, or have questions? Just reply to this email, we'd love to help."
        }
    }
}


const forgotPasswordGeneratorContent = (userName, passwordResetUrl) => {
    return {
        body : {
            name : userName,
            intro : "We got request to reset the password for your account.",
            action : {
                intruction : "To Reset your password click on the button below",
                button : {
                    color : "#1f1e1e00",
                    text : "Reset your password",
                    link : passwordResetUrl
                }
            },
            outro : "Need help, or have questions? Just reply to this email, we'd love to help."
        }
    }
}

export{
    emailverificationGeneratorContent,
    forgotPasswordGeneratorContent,
    sendEmail
}

