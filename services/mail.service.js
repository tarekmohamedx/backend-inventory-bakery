const nodemailer = require('nodemailer');

const sendMail = async(reciverEmail, subject, message)=>{        
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: "tm6229129@gmail.com",
                pass: "pejk pitu spnl pppa"
            }
        })

    const mailOptions = {
        from: "tm6229129@gmail.com",
        to: reciverEmail,
        subject: subject,
         html: message
    }

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.log("Error:", error);
        } else {
          console.log("Email sent:", info.response);
        }
      });
    
}


const pendingOrderSubject = async()=>{
    
}





module.exports =  {
    sendMail,

}