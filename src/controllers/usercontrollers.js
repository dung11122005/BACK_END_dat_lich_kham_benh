import userservice from "../services/userservive"
import bcrypt from 'bcryptjs';

let handlelogin = async (req, res) => {
    let email = req.body.email;
    let password = req.body.password;
    if (!email || !password) {
        return res.status(500).json({
            errcode: 1,
            message: 'missing input parameter'
        })
    }

    let userdata = await userservice.handleruserlogin(email, password)
    // check email exist
    //compare password
    //return  userinfor
    //accecss_token:JWT json web token
    return res.status(200).json({
        errcode: userdata.errcode,
        message: userdata.errmessage,
        user: userdata.user ? userdata.user : {}
    });
}







let handlegetallusers = async (req, res) => {
    let id = req.query.id //All, ID

    if (!id) {
        return res.status(200).json({
            errcode: 1,
            errmessage: 'mising req parametor',
            users: []
        });
    }
    let users = await userservice.getAllusers(id);
    //console.log(users)
    return res.status(200).json({
        errcode: 0,
        errmessage: '0k',
        users
    });
}






let handlecreatenewuser = async (req, res) => {
    let message = await userservice.creatnewuser(req.body)
    //console.log(message)
    return res.status(200).json(message)
}
let handledituser = async (req, res) => {
    let data = req.body
    let message = await userservice.updateuserdata(data);
    return res.status(200).json(message)
}
let handledeleteuser = async (req, res) => {
    if (!req.body.id) {
        return res.status(200).json({
            errcode: 1,
            message: 'missing req parameters'
        })
    }
    let message = await userservice.deleteuser(req.body.id)
    //console.log(message)
    return res.status(200).json(message)
}

let getAllcode = async (req, res) => {
    try {
        // setTimeout(async () => {
        //     let data = await userservice.getAllcodeservice(req.query.type)
        //     return res.status(200).json(data)
        // }, 3000);
        let data = await userservice.getAllcodeservice(req.query.type)
        //console.log('data', data)
        return res.status(200).json(data)
    } catch (e) {
        //console.log('get all code error', e)
        return res.status(200).json({
            errcode: -1,
            errmessage: 'error from server'
        })
    }
}
module.exports = {
    handlelogin: handlelogin,
    handlegetallusers: handlegetallusers,
    handlecreatenewuser: handlecreatenewuser,
    handledituser: handledituser,
    handledeleteuser: handledeleteuser,
    getAllcode: getAllcode

}