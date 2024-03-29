import * as Nodemailer from 'nodemailer';

// async..await is not allowed in global scope, must use a wrapper
export default async function sendResetEmail( email: any, url: String, token: String ) : Promise<any> {
    // Generate test SMTP service account from ethereal.email
    // Only needed if you don't have a real mail account for testing
    //let testAccount = await Nodemailer.createTestAccount();

    // create reusable transporter object using the default SMTP transport
    /* let transporter = Nodemailer.createTransport({
        service: 'gmail',
        secure: true, // true for 465, false for other ports
        auth: {
        user: 'resilientprogrammer@gmail.com', // generated ethereal user
        pass: '4251112237', // generated ethereal password
        }
    }); */

    let transporter = Nodemailer.createTransport({
        name: "www.agronigeria.ng",
        host: "mail.agronigeria.ng",
        port: 465,
        secure: true, // true for 465, false for other ports
        auth: {
            user: "no-reply@agronigeria.ng", // generated ethereal user
            pass: "AgroNigA!!en90", // generated ethereal password
        },
    });

    /* var transporter = nodemailer.createTransport(smtpTransport({
        name: 'www.yourdomain.com',
        host:'smtp.host.com',
        port: port,
        secure: true,
        auth: {
            user: user,
            pass: pass
        }
    })); */

    let mailDetails = {
        from: 'no-reply@agronigeria.ng',
        to: `${email}`,
        subject: 'Account Verification Link',
        text: 'Follow the instructions below',
        html: `
            <h2> Please click on the given link to reset your password <h2>
            <a href="${url}/resetpassword/${token}">${url}/resetpassword/${token}</a>
        `
    }; 
    let info = await transporter.sendMail(mailDetails);

    //console.log("Message sent: %s", info.messageId);
    //console.log("Preview URL: %s", Nodemailer.getTestMessageUrl(info));

    return{
        success: info.messageId ? true : false,
        message: info.messageId ? `check ${email} for your reset password link.  \nToken will expire in 15 mins` : `An Error Occured while sending the email`
    }
    

  // send mail with defined transport object
  
  
  //console.log("Message sent: %s", info.messageId);
  // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

  // Preview only available when sending through an Ethereal account
  //console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
  // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
}
