const nodemailer = require("nodemailer");

const sendEmail = async (options) => {
    const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        auth: {
            user: "sachin2sharma001@gmail.com",
            pass: "fqjxppcdhntarlfa",
        },
    });
    const mailOptions = {
        from: "sachin sharma <sachin2sharma001@gmail.com>",
        to: options.email,
        subject: options.subject,
        text: options.message,
    };
    await transporter.sendMail(mailOptions);
};
module.exports = sendEmail;
