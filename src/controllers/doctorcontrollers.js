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
module.exports = {
    getTopDoctorHome: getTopDoctorHome,
    getAllDoctors: getAllDoctors,
    postInforDoctor: postInforDoctor
}