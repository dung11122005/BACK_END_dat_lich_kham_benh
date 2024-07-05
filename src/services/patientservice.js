import db from "../models/index"
import bcrypt from 'bcryptjs';
import { where } from "sequelize"
import emailService from './emailService'
import { v4 as uuidv4 } from 'uuid';

require('dotenv').config()


let buildUrlEmail = (doctorId, token) => {
    let result = `${process.env.URL_REACT}/verify-booking?token=${token}&doctorId=${doctorId}`
    return result
}


let postBookAppointment = (data) => {

    return new Promise(async (resolve, reject) => {
        try {
            if (!data.email || !data.doctorId || !data.timeType || !data.date || !data.fullName ||
                !data.selectedGender || !data.address
            ) {
                resolve({
                    errcode: 1,
                    errmessage: 'missing required parametor'
                })
            } else {
                let token = uuidv4();
                await emailService.sendSimpleEmail({
                    reciverEmail: data.email,
                    patientName: data.fullName,
                    time: data.timeString,
                    doctorName: data.doctorName,
                    language: data.language,
                    redirectLink: buildUrlEmail(data.doctorId, token)
                })
                //console.log('data', data)
                let user = await db.User.findOrCreate({
                    where: { email: data.email },
                    defaults: {
                        email: data.email,
                        roleId: "R3",
                        gender: data.selectedGender,
                        address: data.address,
                        firstName: data.fullName
                    },
                });
                //console.log('>>> hoi dan it check user:', user[0])
                //console.log('data.email && data.doctorId && data.timeType && data.date:', data.email, data.doctorId, data.timeType, String(data.date), user[0].id)
                if (user && user[0]) {
                    //console.log('data2', data)

                    await db.Booking.findOrCreate({
                        where: { patientId: user[0].id },
                        defaults: {
                            statusId: 'S1',
                            doctorId: data.doctorId,
                            patientId: user[0].id,
                            date: String(data.date),
                            timeType: data.timeType,
                            token: token
                        },
                    });
                }
                resolve({
                    errcode: 0,
                    errmessage: 'Save infor Doctor success!'
                })
            }
        } catch (e) {
            reject(e)
        }
    })
}



let postVerifyBookAppointment = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.doctorId || !data.token) {
                resolve({
                    errcode: 1,
                    errmessage: 'missing required parametor'
                })
            } else {
                let appointment = await db.Booking.findOne({
                    where: {
                        doctorId: data.doctorId,
                        token: data.token,
                        statusId: 'S1'
                    },
                    raw: false
                })

                if (appointment) {
                    appointment.statusId = 'S2'
                    await appointment.save()
                    resolve({
                        errcode: 0,
                        errmessage: 'update the appointment success!'
                    })
                } else {
                    resolve({
                        errcode: '2',
                        errmessage: 'Appointment schedule has been activated or does not exist'
                    })
                }
            }
        } catch (e) {
            reject(e)
        }
    })
}
module.exports = {
    postBookAppointment: postBookAppointment,
    postVerifyBookAppointment: postVerifyBookAppointment
}