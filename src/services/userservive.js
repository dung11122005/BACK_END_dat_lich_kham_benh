import { where } from "sequelize";
import db from "../models/index"
import e from "express";
import bcrypt from 'bcryptjs';
import { raw } from "body-parser";



const salt = bcrypt.genSaltSync(10);


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

let handleruserlogin = (email, password) => {
    return new Promise(async (resolve, reject) => {
        try {
            let userdata = {}
            let isexist = await checkuseremail(email)
            if (isexist) {
                //user already exist
                //compare password
                let user = await db.User.findOne({
                    attributes: ['email', 'roleid', 'password', 'firstName', 'lastName'],
                    where: { email: email },
                    raw: true
                })
                if (user) {
                    let check = await bcrypt.compareSync(password, user.password); // false
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
let getAllusers = (userId) => {
    return new Promise(async (resolve, reject) => {
        try {
            let users = ''
            if (userId === 'ALL') {
                users = await db.User.findAll({
                    attributes: {
                        exclude: ['password']
                    }
                })
            }
            if (userId && userId !== 'ALL') {
                users = await db.User.findOne({
                    attributes: {
                        exclude: ['password']
                    },
                    where: { id: userId },
                })
            }
            resolve(users)
        } catch (e) {
            reject(e)
        }
    })
}
let creatnewuser = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            let check = await checkuseremail(data.email)
            if (check === true) {
                resolve({
                    errcode: 2,
                    message: 'your email is already in used, plz try another email'
                })
            } else {
                let hashpasswordfrombcryptjs = await hashUserPassword(data.password)
                await db.User.create({
                    email: data.email,
                    password: hashpasswordfrombcryptjs,
                    firstName: data.firstName,
                    lastName: data.lastName,
                    address: data.address,
                    phonenumber: data.phonenumber,
                    gender: data.gender,
                    roleId: data.roleId,
                    positionId: data.positionId
                })
                resolve({
                    errcode: 0,
                    message: 'ok'
                });
            }
        } catch (e) {
            reject(e)
        }
    })
}
let deleteuser = (userid) => {
    return new Promise(async (resolve, reject) => {
        try {
            let founduser = await db.User.findOne({
                where: { id: userid }
            })
            if (!founduser) {
                console.log(founduser)
                resolve({
                    errcode: 2,
                    message: `the user int't `
                })
            }
            await db.User.destroy({
                where: { id: userid }
            })
            resolve({
                errcode: 0,
                message: 'the user is delete'
            })
        } catch (e) {
            reject(e)
        }
    })
}
let updateuserdata = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            //console.log('edit node js', data)
            if (!data.id) {
                resolve({
                    errcode: 2,
                    message: 'missing required parameters'
                })
            }
            let user = await db.User.findOne({
                where: { id: data.id },
                raw: false
            })
            if (user) {
                user.firstName = data.firstName
                user.lastName = data.lastName
                user.address = data.address
                await user.save();
                resolve({
                    errcode: 0,
                    message: 'update the user sucsess'
                });
            } else {
                resolve({
                    errcode: 1,
                    message: `user's not found!`
                });
            }
        } catch (e) {
            reject(e)
        }
    })
}



let getAllcodeservice = (typeinput) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!typeinput) {
                resolve({
                    errcode: 1,
                    errmessage: 'missing required parametor'
                })
            } else {
                let res = {}
                let allcode = ''
                allcode = await db.Allcode.findAll({
                    where: { type: typeinput }
                })
                res.errcode = 0
                res.data = allcode
                resolve(res)
            }
        } catch (e) {
            reject(e)
        }

    })
}

module.exports = {
    handleruserlogin: handleruserlogin,
    getAllusers: getAllusers,
    creatnewuser: creatnewuser,
    deleteuser: deleteuser,
    updateuserdata: updateuserdata,
    getAllcodeservice: getAllcodeservice
}