import doctorservice from '../services/doctorservice'



let getTopDoctorHome = async (req, res) => {
    let limit = req.query.limit
    if (!limit) limit = 10
    try {
        let response = await doctorservice.getTopDoctorHome(+limit)
        return res.status(200).json(response)

    } catch (e) {
        console.log(e)
        return res.status(200).json({
            errcode: -1,
            message: 'error from server...'
        })
    }
}



let getAllDoctors = async (req, res) => {
    try {
        let doctors = await doctorservice.getAllDoctors()
        return res.status(200).json(doctors)
    } catch (e) {
        return res.status(200).json({
            errcode: -1,
            errmessage: 'err from the server'
        })
    }
}




let postInforDoctor = async (req, res) => {
    try {
        let response = await doctorservice.SeveDetailInforDoctor(req.body)
        return res.status(200).json(response)
    } catch (e) {
        return res.status(200).json({
            errcode: -1,
            errmessage: 'err from the server'
        })
    }
}




let getDetailDoctorById = async (req, res) => {
    try {
        let infor = await doctorservice.getDetailDoctorById(req.query.id)
        return res.status(200).json(infor)
    } catch (e) {
        console.log(e)
        return res.status(200).json({
            errcode: -1,
            errmessage: 'err from the server'
        })
    }
}



let bulkCreateSchedule = async (req, res) => {
    try {
        let infor = await doctorservice.bulkCreateSchedule(req.body)
        return res.status(200).json(infor)
    } catch (e) {
        console.log(e)
        return res.status(200).json({
            errcode: -1,
            errmessage: 'err from the server'
        })
    }
}

let getScheduleByDate = async (req, res) => {
    try {
        let infor = await doctorservice.getScheduleByDate(req.query.doctorId, req.query.date)
        return res.status(200).json(infor)
    } catch (e) {
        console.log(e)
        return res.status(200).json({
            errcode: -1,
            errmessage: 'err from the server'
        })
    }
}

let getExtraInforDoctorById = async (req, res) => {
    try {
        let infor = await doctorservice.getExtraInforDoctorById(req.query.doctorId)
        return res.status(200).json(infor)
    } catch (e) {
        console.log(e)
        return res.status(200).json({
            errcode: -1,
            errmessage: 'err from the server'
        })
    }
}
module.exports = {
    getTopDoctorHome: getTopDoctorHome,
    getAllDoctors: getAllDoctors,
    postInforDoctor: postInforDoctor,
    getDetailDoctorById: getDetailDoctorById,
    bulkCreateSchedule: bulkCreateSchedule,
    getScheduleByDate: getScheduleByDate,
    getExtraInforDoctorById: getExtraInforDoctorById
}