import { json } from "body-parser";
import db from "../models/index"
import CRUDservice from "../services/CRUDservice";
let gethomepage = async (req, res) => {
    try {
        let data = await db.User.findAll();
        console.log(data)
        return res.render("homepage.ejs", {
            data: JSON.stringify(data)
        })
    } catch (e) {
        console.log(e);
    }
}



let getCRUD = (req, res) => {
    return res.render('crud.ejs');
}




let postCRUD = async (req, res) => {
    let message = await CRUDservice.createNewUser(req.body);
    console.log(message)
    //console.log(req.body)
    return res.render('post crud')
}
let displaygetCRUD = async (req, res) => {
    let data = await CRUDservice.getAlluser();
    console.log(data);
    return res.render('displayCRUD.ejs', {
        datatable: data
    })
}
let getEditCRUD = async (req, res) => {
    let userId = req.query.id
    console.log(userId)
    if (userId) {
        let userData = await CRUDservice.getuserinfobyId(userId);
        console.log(userData);
        return res.render('editCRUD.ejs', {
            user: userData
        })
    } else {
        return res.send('edit crud')
    }
}
let putCRUD = async (req, res) => {
    let data = req.body
    let allusers = await CRUDservice.updateuserCRUDdata(data);
    return res.render('displayCRUD.ejs', {
        datatable: allusers
    })
}
let deleteCRUD = async (req, res) => {
    let id = req.query.id
    if (id) {
        await CRUDservice.deleteuserbyid(id)
        return res.send('delete sucseed')
    } else {
        return res.send('user not found')
    }


}




module.exports = {
    gethomepage: gethomepage,
    getCRUD: getCRUD,
    postCRUD: postCRUD,
    displaygetCRUD: displaygetCRUD,
    getEditCRUD: getEditCRUD,
    putCRUD: putCRUD,
    deleteCRUD: deleteCRUD
}