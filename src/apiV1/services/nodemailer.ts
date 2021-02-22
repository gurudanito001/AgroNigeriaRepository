import * as Nodemailer from 'nodemailer';

// async..await is not allowed in global scope, must use a wrapper
export default async function sendResetEmail( email: any, url: String, token: String ) : Promise<any> {
    // Generate test SMTP service account from ethereal.email
    // Only needed if you don't have a real mail account for testing
    //let testAccount = await Nodemailer.createTestAccount();

    // create reusable transporter object using the default SMTP transport
    let transporter = Nodemailer.createTransport({
        service: 'gmail',
        secure: false, // true for 465, false for other ports
        auth: {
        user: 'resilientprogrammer@gmail.com', // generated ethereal user
        pass: '4251112237', // generated ethereal password
        }
    });

    let mailDetails = {
        from: 'resilientprogrammer@gmail.com',
        to: `${email}`,
        subject: 'Account Verification Link',
        text: 'Follow the instructions below',
        html: `
            <h2> Please click on the given link to reset your password <h2>
            <p>${url}/resetpassword/${token}</p>
        `
    }; 
    let info = await transporter.sendMail(mailDetails);

    //console.log("Message sent: %s", info.messageId);
    //console.log("Preview URL: %s", Nodemailer.getTestMessageUrl(info));

    return{
        success: info.messageId ? true : false,
        message: info.messageId ? `check ${email} for your reset password link` : `An Error Occured while sending the email`
    }
    

  // send mail with defined transport object
  
  
  //console.log("Message sent: %s", info.messageId);
  // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

  // Preview only available when sending through an Ethereal account
  //console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
  // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
}
