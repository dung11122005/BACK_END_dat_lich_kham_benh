import nodemailer from 'nodemailer'
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
        from: '"HOI DAN IT 👻" <dungakaishi900@gmail.com>', // sender address
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
        <p>Bạn nhận được email này vì đã đặt lịch khám bệnh online trên HOI DAN IT channel</p>
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
        <p>You received this email because you scheduled an online medical examination on HOI DAN IT channel</p>
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

module.exports = {
    sendSimpleEmail: sendSimpleEmail
}