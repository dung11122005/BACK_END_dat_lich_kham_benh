import express from "express";
import homecontrollers from "../controllers/homecontrollers";
import usercontrollers from "../controllers/usercontrollers"
import doctorcontrollers from '../controllers/doctorcontrollers'


let router = express.Router();

let initwebrouter = (app) => {
    router.get('/', homecontrollers.gethomepage)
    router.get('/crud', homecontrollers.getCRUD)



    router.post('/post-crud', homecontrollers.postCRUD)
    router.get('/get-crud', homecontrollers.displaygetCRUD)
    router.get('/edit-crud', homecontrollers.getEditCRUD)
    router.post('/put-crud', homecontrollers.putCRUD)
    router.get('/delete-crud', homecontrollers.deleteCRUD)



    router.post('/api/login', usercontrollers.handlelogin)
    router.get('/api/get-all-users', usercontrollers.handlegetallusers)
    router.post('/api/create-new-user', usercontrollers.handlecreatenewuser)
    router.put('/api/edit-user', usercontrollers.handledituser)
    router.delete('/api/delete-user', usercontrollers.handledeleteuser)

    router.get('/api/allcode', usercontrollers.getAllcode)



    router.get('/api/top-doctor-home', doctorcontrollers.getTopDoctorHome)
    router.get('/api/get-all-doctors', doctorcontrollers.getAllDoctors)
    router.post('/api/save-infor-doctors', doctorcontrollers.postInforDoctor)




    return app.use('/', router);
}

module.exports = initwebrouter;