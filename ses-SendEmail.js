const { SESClient, SendEmailCommand} = require("@aws-sdk/client-ses");
require('dotenv').config();

const SES_CONFIG = {
    credentials:{
        accessKeyId: process.env.AWS_ACCESS_KEY,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
    region: process.env.AWS_SES_REGION
}
// create ses client
const sesClient = new SESClient(SES_CONFIG);

const sendEmail = async (recipientEmail, name) => {
    let params = {
        Source: process.env.AWS_SES_SENDER,
        Destination: {
            ToAddresses: [recipientEmail]
        },
        ReplyToAddress:[recipientEmail],
        Message: {
            Subject: {
                Charset: "UTF-8",
                Data: `${name}, you have meet with Verbalyze`
            },
            Body:{
                Html: {
                    Charset: "UTF-8",
                    Data: `<h1>Meet with Verbalyze, where AI Intelligence meets Brillance<h1>`
                },
                // text fallback for html content
                Text:{
                    Charset: "UTF-8",
                    Data: "Meet with Verbalyze, where AI Intelligence meets Brillance"
                }
            }
        },
    };

    try{
        const sendEmailCommand = new SendEmailCommand(params);
        const res = await sesClient.send(sendEmailCommand);
        console.log("EMAIL WAS SENT SUCCESSFULLY!");
    } catch(error){
        console.log(error, "Something went wrong, email not sent!")
    }
}

sendEmail("vasujhawar2001@gmail.com", "Vasu OG");