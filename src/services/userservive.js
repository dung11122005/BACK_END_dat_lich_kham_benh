import { where } from "sequelize";
import db from "../models/index"
import e from "express";
import bcrypt from 'bcryptjs';







let handleruserlogin = (email, password) => {
    return new Promise(async (resolve, reject) => {
        try {
            let userdata = {}
            let isexist = await checkuseremail(email)
            if (isexist) {
                //user already exist
                //compare password
                let user = await db.User.findOne({
                    attributes: ['email', 'roleid', 'password'],
                    where: { email: email },
                    raw: true
                })
                if (user) {
                    //let check = await bcrypt.compareSync(password, user.password); // false
                    let check = true
                    if (check) {
                        userdata.errcode = 0
                        userdata.errmessage = `ok`
                        delete user.password;
                        userdata.user = user
                    } else {
                        userdata.errcode = 3
                        userdata.errmessage = `wrong password`
                        userdata.user = user
                    }
                } else {
                    userdata.errcode = 2
                    userdata.errmessage = `user's not found`
                }
            } else {
                //return error
                userdata.errcode = 1
                userdata.errmessage = `your's email isn't exist in your system, plz try other email`
            }

            resolve(userdata)
        } catch (e) {
            reject(e)
        }
    })
}

let compareuserpassword = () => {
    return new Promise((resolve, reject) => {
        try {

        } catch (e) {
            reject(e);
        }
    })
}
let checkuseremail = (useremail) => {
    return new Promise(async (resolve, reject) => {
        try {
            let user = await db.User.findOne({
                where: { email: useremail }
            });
            if (user) {
                resolve(true)
            } else {
                resolve(false)
            }
        } catch (e) {
            reject(e)
        }
    })
}


module.exports = {
    handleruserlogin: handleruserlogin,
}