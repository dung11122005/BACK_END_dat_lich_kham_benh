import bcrypt from 'bcryptjs';
import db from "../models/index"


const salt = bcrypt.genSaltSync(10);

let createNewUser = async (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            let hashpasswordfrombcryptjs = await hashUserPassword(data.password)
            await db.User.create({
                email: data.email,
                password: hashpasswordfrombcryptjs,
                firstName: data.firstName,
                lastName: data.lastName,
                address: data.address,
                phonenumber: data.phonenumber,
                gender: data.gender === '1' ? true : false,
                roleId: data.roleId,
            })
            resolve('ok create new user succeed');
        } catch (error) {
            reject(e)
        }


    })

}

let hashUserPassword = (password) => {
    return new Promise(async (resolve, reject) => {
        try {
            let hashpassword = await bcrypt.hashSync(password, salt);
            resolve(hashpassword)
        } catch (e) {
            reject(e)
        }

    })
}

module.exports = {
    createNewUser: createNewUser,
    hashUserPassword: hashUserPassword
}