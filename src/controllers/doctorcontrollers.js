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





module.exports = {
    getTopDoctorHome: getTopDoctorHome
}