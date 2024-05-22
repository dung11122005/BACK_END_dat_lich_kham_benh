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
    return res.send('post crud')
}









module.exports = {
    gethomepage: gethomepage,
    getCRUD: getCRUD,
    postCRUD: postCRUD
}