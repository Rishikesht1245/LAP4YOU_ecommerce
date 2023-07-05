const nodemailer = require('nodemailer');


function sendMail(email, subject, status, person, id){

        // creating transporter
        let transporter = nodemailer.createTransport({
            service:'Gmail',
            auth: {
                  user : process.env.TRANSPORTER_USERNAME,
                  pass : process.env.TRANSPORTER_PASSWORD,
            },
      });

       // mail options
       let mailOptions = {
            from:process.env.TRANSPORTER_USERNAME,
            to: email,
            subject : `Order has been ${status} successfully!`,
            html: `<h1> order has been ${status} successfully</h1>
                  </br><h4 style="text-color: red, font-weight: bold"><p>${subject}</p></h4>
                  </br><p><a href = /${person}/orders/${id}>Click here </a> to view the order Details </p>`,
      };

      transporter.sendMail(mailOptions, (error, info)=> {
            if(error){
                  console.log('error Occured : '+error);
            } else{
                  console.log(`Email Sent SuccessFully`);
            }
            return;
      });
}

module.exports = sendMail;