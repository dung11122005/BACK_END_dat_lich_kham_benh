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




module.exports = {
    handlelogin: handlelogin
}