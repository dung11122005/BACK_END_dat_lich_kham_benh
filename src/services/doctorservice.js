import { where } from "sequelize"
import db from "../models/index"
import { raw } from "body-parser"
import _, { reject } from 'lodash'
require('dotenv').config()


const MAX_NUMBER_SCHEDULE = process.env.MAX_NUMBER_SCHEDULE
let getTopDoctorHome = (limitinput) => {
    return new Promise(async (resolve, reject) => {
        try {
            let users = await db.User.findAll({
                limit: limitinput,
                where: { roleId: 'R2' },
                order: [['createdAt', 'DESC']],
                attributes: {
                    exclude: ['password']
                },
                include: [
                    { model: db.Allcode, as: 'positionData', attributes: ['valueEn', 'valueVi'] },
                    { model: db.Allcode, as: 'genderData', attributes: ['valueEn', 'valueVi'] }
                ],
                raw: true,
                nest: true
            })

            resolve({
                errcode: 0,
                data: users
            })
        } catch (e) {
            reject(e)
        }
    })
}



let getAllDoctors = () => {
    return new Promise(async (resolve, reject) => {
        try {
            let doctors = await db.User.findAll({
                where: { roleId: 'R2' },
                attributes: {
                    exclude: ['password', 'image']
                }
            })
            resolve({
                errcode: 0,
                data: doctors
            })
        } catch (e) {
            reject(e)
        }
    })
}





let SeveDetailInforDoctor = (inputData) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!inputData.doctorId || !inputData.contentHTML || !inputData.contentMarkdown) {
                resolve({
                    errcode: 1,
                    errmessage: 'Missing parameter'
                })
            } else {
                if (inputData.action === 'CREATE') {
                    await db.Markdown.create({
                        contentHTML: inputData.contentHTML,
                        contentMarkdown: inputData.contentMarkdown,
                        description: inputData.description,
                        doctorId: inputData.doctorId
                    })
                } else if (inputData.action === 'EDIT') {
                    let doctorMarkdown = await db.Markdown.findOne({
                        where: { doctorId: inputData.doctorId },
                        raw: false
                    })
                    if (doctorMarkdown) {
                        doctorMarkdown.contentHTML = inputData.contentHTML
                        doctorMarkdown.contentMarkdown = inputData.contentMarkdown
                        doctorMarkdown.description = inputData.description
                        doctorMarkdown.updatedAt = new Date()
                        await doctorMarkdown.save();
                    }
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



let getDetailDoctorById = (inputId) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!inputId) {
                resolve({
                    errcode: 1,
                    errmessage: 'Missing required parameter!'
                })
            } else {
                let data = await db.User.findOne({
                    where: {
                        id: inputId
                    },
                    attributes: {
                        exclude: ['password']
                    },
                    include: [
                        { model: db.Markdown, attributes: ['contentMarkdown', 'contentHTML', 'description'] },
                        { model: db.Allcode, as: 'positionData', attributes: ['valueEn', 'valueVi'] },
                    ],
                    raw: false,
                    nest: true
                })
                if (data && data.image) {
                    data.image = new Buffer(data.image, 'base64').toString('binary')
                }
                if (!data) data = {}
                resolve({
                    errcode: 0,
                    data: data
                })
            }
        } catch (e) {
            reject(e)
        }
    })
}



let bulkCreateSchedule = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.arrSchedule || !data.doctorId || !data.formatedDate) {
                resolve({
                    errcode: 1,
                    errmessage: 'Missing required param!'
                })
            } else {
                let schedule = data.arrSchedule
                if (schedule && schedule.length > 0) {
                    schedule = schedule.map((item => {
                        item.maxNumber = MAX_NUMBER_SCHEDULE
                        return item
                    }))
                }
                //console.log('hoi dan it channel: data send:', schedule)
                let exesting = await db.Schedule.findAll({
                    where: { doctorId: data.doctorId, date: data.formatedDate },
                    attributes: ['doctorId', 'date', 'timeType', 'maxNumber'],
                    row: true
                })

                if (exesting && exesting.length > 0) {
                    exesting = exesting.map(item => {
                        item.date = new Date(item.date).getTime()
                        return item
                    })
                }

                let toCreate = _.differenceWith(schedule, exesting, (a, b) => {
                    return a.timeType === b.timeType && a.date === b.date
                })
                console.log('exesting', exesting)
                console.log('check different=========================:', toCreate)
                if (toCreate && toCreate.length > 0) {
                    await db.Schedule.bulkCreate(toCreate)
                }

                resolve({
                    errcode: 0,
                    errmessage: 'ok'
                })
            }

        } catch (e) {
            reject(e)
        }
    })
}

let getScheduleByDate = (doctorId, date) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!doctorId || !date) {
                resolve({
                    errcode: 1,
                    errmessage: 'missing required parameter!'
                })
            } else {
                let dataSchedule = await db.Schedule.findAll({
                    where: {
                        doctorId: doctorId,
                        date: date
                    }
                })
                if (!dataSchedule) dataSchedule = []
                resolve({
                    errcode: 0,
                    data: dataSchedule
                })
            }
        } catch (e) {
            reject(e)
        }
    })
}
module.exports = {
    getTopDoctorHome: getTopDoctorHome,
    getAllDoctors: getAllDoctors,
    SeveDetailInforDoctor: SeveDetailInforDoctor,
    getDetailDoctorById: getDetailDoctorById,
    bulkCreateSchedule: bulkCreateSchedule,
    getScheduleByDate: getScheduleByDate
}