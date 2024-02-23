import NodeMailer from "nodemailer";

// const transporter = NodeMailer.createTransport({
//     host: process.env.BREVO_HOST,
//     port: process.env.BREVO_PORT,
//     // secure: false,
//     auth: {
//         user: process.env.BREVO_USERNAME,
//         pass: process.env.BREVO_PASSWORD
//     }

// });

const transporter = NodeMailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    auth: {
        user: 'reggie.dach95@ethereal.email',
        pass: 'UKt5sMnRQ1cnfmpuvp'
    }

});

async function contactMMail(name,message) {
    try {
        console.log(name,message);
        const info = await transporter.sendMail({
            from: "MockMasters <mockmasters.official@gmail.com>",
            to: 'vishalnit2022@gmail.com',
            subject: "mail sent from  contact form",
            name:name,
            message:message
        })
        console.log("from mail function");
        console.log(info.messageId);
        return info.messageId;
    } catch (error) {
        console.log(error);
    }
}

export default {contactMMail};
