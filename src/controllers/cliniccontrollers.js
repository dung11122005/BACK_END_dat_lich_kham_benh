import clinicservice from '../services/clinicservice'


let createClinic = async (req, res) => {
    try {
        let infor = await clinicservice.createClinic(req.body)
        return res.status(200).json(infor)
    } catch (e) {
        console.log(e)
        return res.status(200).json({
            errcode: -1,
            errmessage: 'err from the server'
        })
    }
}


let getAllClinic = async (req, res) => {
    try {
        let infor = await clinicservice.getAllClinic()
        return res.status(200).json(infor)
    } catch (e) {
        console.log(e)
        return res.status(200).json({
            errcode: -1,
            errmessage: 'err from the server'
        })
    }
}



let getDetailClinicById = async (req, res) => {
    try {
        let infor = await clinicservice.getDetailClinicById(req.query.id)
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
    createClinic: createClinic,
    getAllClinic: getAllClinic,
    getDetailClinicById: getDetailClinicById
}