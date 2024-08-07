import { where } from "sequelize"
import db from "../models/index"
import { raw } from "body-parser"
import _, { reject } from 'lodash'
import emailService from './emailService'
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


let checkRequiredFields = (inputData) => {
    let arrFields = ['doctorId', 'contentHTML', 'contentMarkdown', 'action',
        'selectedPrice', 'selectedProvince', 'selectedPayment', 'nameClinic',
        'addressClinic', 'note', 'specialtyId']

    let isValid = true
    let element = ''
    for (let i = 0; i < arrFields.length; i++) {
        if (!inputData[arrFields[i]]) {
            isValid = false
            element = arrFields[i]
            break
        }
    }

    return {
        isValid: isValid,
        element: element
    }
}


let SeveDetailInforDoctor = (inputData) => {
    return new Promise(async (resolve, reject) => {
        try {
            let checkObj = checkRequiredFields(inputData)
            if (checkObj.isValid === false) {
                resolve({
                    errcode: 1,
                    errmessage: `Missing parameter ${checkObj.element}`
                })
            } else {
                //upsert to markdown
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
                //upsert to doctor infor table
                let doctorInfor = await db.Doctor_Infor.findOne({
                    where: { doctorId: inputData.doctorId },
                    raw: false
                })
                if (doctorInfor) {
                    //update

                    doctorInfor.priceId = inputData.selectedPrice
                    doctorInfor.provinceId = inputData.selectedProvince
                    doctorInfor.paymentId = inputData.selectedPayment
                    doctorInfor.nameClinic = inputData.nameClinic
                    doctorInfor.addressClinic = inputData.addressClinic
                    doctorInfor.note = inputData.note
                    doctorInfor.specialtyId = inputData.specialtyId
                    doctorInfor.clinicId = inputData.clinicId
                    await doctorInfor.save();
                } else {
                    //create
                    await db.Doctor_Infor.create({
                        doctorId: inputData.doctorId,
                        priceId: inputData.selectedPrice,
                        provinceId: inputData.selectedProvince,
                        paymentId: inputData.selectedPayment,
                        nameClinic: inputData.nameClinic,
                        addressClinic: inputData.addressClinic,
                        note: inputData.note,
                        specialtyId: inputData.specialtyId,
                        clinicId: inputData.clinicId
                    })
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
                        {
                            model: db.Doctor_Infor,
                            attributes: {
                                exclude: ['doctorId', 'id']
                            },
                            include: [
                                { model: db.Allcode, as: 'priceTypedata', attributes: ['valueEn', 'valueVi'] },
                                { model: db.Allcode, as: 'provinceTypeData', attributes: ['valueEn', 'valueVi'] },
                                { model: db.Allcode, as: 'paymentTypeData', attributes: ['valueEn', 'valueVi'] },
                            ]
                        },
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

                let toCreate = _.differenceWith(schedule, exesting, (a, b) => {
                    return a.timeType === b.timeType && +a.date === +b.date
                })
                //console.log('exesting', exesting)
                //console.log('toCreate', toCreate)
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
                    },
                    include: [
                        { model: db.Allcode, as: 'timeTypeData', attributes: ['valueEn', 'valueVi'] },
                        { model: db.User, as: 'doctorData', attributes: ['firstName', 'lastName'] },
                    ],
                    raw: false,
                    nest: true
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

let getExtraInforDoctorById = (inputId) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!inputId) {
                resolve({
                    errcode: 1,
                    errmessage: 'missing required parameter!'
                })
            } else {
                let data = await db.Doctor_Infor.findOne({
                    where: { doctorId: inputId },
                    attributes: {
                        exclude: ['doctorId', 'id']
                    },
                    include: [
                        { model: db.Allcode, as: 'priceTypedata', attributes: ['valueEn', 'valueVi'] },
                        { model: db.Allcode, as: 'provinceTypeData', attributes: ['valueEn', 'valueVi'] },
                        { model: db.Allcode, as: 'paymentTypeData', attributes: ['valueEn', 'valueVi'] },
                    ],
                    raw: false,
                    nest: true
                })
                if (!data) data = []
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

let getProfileDoctorById = (inputId) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!inputId) {
                resolve({
                    errcode: 1,
                    errmessage: 'missing required parameter!'
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
                        {
                            model: db.Doctor_Infor,
                            attributes: {
                                exclude: ['doctorId', 'id']
                            },
                            include: [
                                { model: db.Allcode, as: 'priceTypedata', attributes: ['valueEn', 'valueVi'] },
                                { model: db.Allcode, as: 'provinceTypeData', attributes: ['valueEn', 'valueVi'] },
                                { model: db.Allcode, as: 'paymentTypeData', attributes: ['valueEn', 'valueVi'] },
                            ]
                        },
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


let getListPatientForDoctor = (doctorId, date) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!doctorId || !date) {
                resolve({
                    errcode: 1,
                    errmessage: 'missing required parameter!'
                })
            } else {
                let data = await db.Booking.findAll({
                    where: {
                        statusId: 'S2',
                        doctorId: doctorId,
                        date: date
                    },
                    include: [
                        {
                            model: db.User, as: 'patientidData', attributes: ['email', 'firstName', 'address', 'gender'],
                            include: [
                                { model: db.Allcode, as: 'genderData', attributes: ['valueVi', 'valueEn'] }
                            ],
                        },
                        { model: db.Allcode, as: 'timeTypeDataPatient', attributes: ['valueVi', 'valueEn'] }
                    ],
                    raw: false,
                    nest: true
                })
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


let sendRemedy = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.email || !data.doctorId || !data.patientId || !data.timetype) {

                resolve({
                    errcode: 1,
                    errmessage: 'missing required parameter!'
                })
            } else {
                //console.log('data:', data.timetype)
                let appointment = await db.Booking.findOne({
                    where: {
                        doctorId: data.doctorId,
                        patientId: data.patientId,
                        timeType: data.timetype,
                        statusId: 'S2'
                    },
                    raw: false
                })
                //console.log('data1:', data)
                if (appointment) {
                    appointment.statusId = 'S3'
                    await appointment.save()
                }
                console.log('language', data.language)
                await emailService.sendAttachment(data)

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


module.exports = {
    getTopDoctorHome: getTopDoctorHome,
    getAllDoctors: getAllDoctors,
    SeveDetailInforDoctor: SeveDetailInforDoctor,
    getDetailDoctorById: getDetailDoctorById,
    bulkCreateSchedule: bulkCreateSchedule,
    getScheduleByDate: getScheduleByDate,
    getExtraInforDoctorById: getExtraInforDoctorById,
    getProfileDoctorById: getProfileDoctorById,
    getListPatientForDoctor: getListPatientForDoctor,
    sendRemedy: sendRemedy
}