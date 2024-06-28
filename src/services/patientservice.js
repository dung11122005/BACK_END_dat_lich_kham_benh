import db from "../models/index"
import bcrypt from 'bcryptjs';
import { where } from "sequelize"
require('dotenv').config()



let postBookAppointment = (data) => {

    return new Promise(async (resolve, reject) => {
        try {
            if (!data.email || !data.doctorId || !data.timeType || !data.date) {
                resolve({
                    errcode: 1,
                    errmessage: 'missing required parametor'
                })
            } else {
                //console.log('data', data)
                let user = await db.User.findOrCreate({
                    where: { email: data.email },
                    defaults: {
                        email: data.email,
                        roleId: "R3"
                    },
                });
                console.log('>>> hoi dan it check user:', user[0])
                console.log('data.email && data.doctorId && data.timeType && data.date:', data.email, data.doctorId, data.timeType, String(data.date), user[0].id)
                if (user && user[0]) {
                    console.log('data2', data)

                    await db.Booking.findOrCreate({
                        where: { patientid: user[0].id },
                        defaults: {
                            statusId: 'S1',
                            doctorId: data.doctorId,
                            patientid: user[0].id,
                            date: String(data.date),
                            timeType: data.timeType
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


module.exports = {
    postBookAppointment: postBookAppointment
}