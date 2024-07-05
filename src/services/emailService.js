import { reject } from 'lodash';
import nodemailer from 'nodemailer'
import { promises } from 'nodemailer/lib/xoauth2';
import { Promise } from 'sequelize';
require('dotenv').config()


let sendSimpleEmail = async (dataSend) => {
    const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false, // Use `true` for port 465, `false` for all other ports
        auth: {
            user: process.env.EMAIL_APP,
            pass: process.env.EMAIL_APP_PASSWORD,
        },
    });

    // async..await is not allowed in global scope, must use a wrapper

    // send mail with defined transport object
    const info = await transporter.sendMail({
        from: '"BOOKING CARE 👻" <dungakaishi900@gmail.com>', // sender address
        to: dataSend.reciverEmail, // list of receivers
        subject: "Thông tin đặt lịch khám bệnh", // Subject line
        //text: "Hello world?", // plain text body
        html: getBodyHTMLEmail(dataSend), // html body
    });
}



let getBodyHTMLEmail = (dataSend) => {
    let result = ''
    console.log('dataSend.language', dataSend.language)
    if (dataSend.language === 'vi') {
        result = `<h3>Xin chào ${dataSend.patientName}</h3>
        <p>Bạn nhận được email này vì đã đặt lịch khám bệnh online trên Booking care</p>
        <P>Thông tin đặt lịch khám bệnh:</P>
        <div><b>Thời gian: ${dataSend.time}</b></div>
        <div><b>Bác sĩ: ${dataSend.doctorName}</b></div>

        <p>Nếu các thông tin là đúng sự thật, vui lòng click vào đường link bên dưới
        để xác nhận và hoàn tất thủ tục đặt lịch khám bệnh
        </p>
        <div>
        <a href=${dataSend.redirectLink} target="_blank">Click here</a>
        </div>
        
        <div>Xin chân thành cảm ơn</div>
        `
    }
    if (dataSend.language === 'en') {
        result = `<h3>Hello ${dataSend.patientName}</h3>
        <p>You received this email because you scheduled an online medical examination on Booking care</p>
        <P>Information for scheduling medical examination:</P>
        <div><b>Time: ${dataSend.time}</b></div>
        <div><b>Doctor: ${dataSend.doctorName}</b></div>

        <p>If the information is true, please click on the link below
        to confirm and complete the medical appointment booking procedure
        </p>
        <div>
        <a href=${dataSend.redirectLink} target="_blank">Click here</a>
        </div>


        <div>Sincerely thank</div>`
    }
    return result
}

let getBodyHTMLEmailRemedy = (dataSend) => {
    let result = ''
    console.log('dataSend.language', dataSend.language)
    if (dataSend.language === 'vi') {
        result = `<h3>Xin chào ${dataSend.patientidName}</h3>
        <p>Bạn nhận được email này vì đã đặt lịch khám bệnh online trên Booking care thành công</p>
        <P>Thông tin đơn thuốc/hóa đơn được gửi trong file đính kèm:</P>
      
        <div>Rất vui vì bạn đã sử dụng dịch vụ, Xin chân thành cảm ơn</div>
        `
    }
    if (dataSend.language === 'en') {
        result = `<h3>Hello ${dataSend.patientidName}</h3>
        <p>You received this email because you have successfully booked an online medical appointment on Booking care</p>
        <P>Prescription/invoice information is sent in the attached file:</P>
       
        <div>We're glad you used the service. Thank you very much</div>`
    }
    return result
}

let sendAttachment = async (dataSend) => {
    const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false, // Use `true` for port 465, `false` for all other ports
        auth: {
            user: process.env.EMAIL_APP,
            pass: process.env.EMAIL_APP_PASSWORD,
        },
    });

    // async..await is not allowed in global scope, must use a wrapper

    // send mail with defined transport object
    const info = await transporter.sendMail({
        from: '"BOOKING CARE 👻" <dungakaishi900@gmail.com>', // sender address
        to: dataSend.email, // list of receivers
        subject: "Kết quả đặt lịch khám bệnh", // Subject line
        //text: "Hello world?", // plain text body
        html: getBodyHTMLEmailRemedy(dataSend), // html body
        attachments: [
            {   // encoded string as an attachment
                filename: `remedy-${dataSend.patientId}-${new Date().getTime()}.png`,
                content: dataSend.imgBase64.split("base64,")[1],
                encoding: 'base64'
            }
        ],
    });

}

module.exports = {
    sendSimpleEmail: sendSimpleEmail,
    sendAttachment: sendAttachment
}