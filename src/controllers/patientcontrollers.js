import patientservice from '../services/patientservice'

let postBookAppointment = async (req, res) => {
    try {
        let infor = await patientservice.postBookAppointment(req.body)
        return res.status(200).json(infor)
    } catch (e) {
        console.log(e)
        return res.status(200).json({
            errcode: -1,
            errmessage: 'err from the server'
        })
    }
}

let postVerifyBookAppointment = async (req, res) => {
    try {
        let infor = await patientservice.postVerifyBookAppointment(req.body)
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
    postBookAppointment: postBookAppointment,
    postVerifyBookAppointment: postVerifyBookAppointment
}