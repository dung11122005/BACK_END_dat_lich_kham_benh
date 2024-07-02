import specialtyservice from '../services/specialtyservice'

let createSpecialty = async (req, res) => {
    try {
        let infor = await specialtyservice.createSpecialty(req.body)
        return res.status(200).json(infor)
    } catch (e) {
        console.log(e)
        return res.status(200).json({
            errcode: -1,
            errmessage: 'err from the server'
        })
    }
}


let getAllSpecialty = async (req, res) => {
    try {
        let infor = await specialtyservice.getAllSpecialty()
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
    createSpecialty: createSpecialty,
    getAllSpecialty: getAllSpecialty
}