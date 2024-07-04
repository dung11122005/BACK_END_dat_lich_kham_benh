import express from "express";
import homecontrollers from "../controllers/homecontrollers";
import usercontrollers from "../controllers/usercontrollers"
import doctorcontrollers from '../controllers/doctorcontrollers'
import patientcontrollers from '../controllers/patientcontrollers'
import specialtycontrollers from "../controllers/specialtycontrollers";
import cliniccontrollers from '../controllers/cliniccontrollers'

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
    router.get('/api/get-detail-doctor-by-id', doctorcontrollers.getDetailDoctorById)
    router.post('/api/bulk-create-schedule', doctorcontrollers.bulkCreateSchedule)
    router.get('/api/get-schedule-doctor-by-date', doctorcontrollers.getScheduleByDate)
    router.get('/api/get-extra-infor-doctor-by-id', doctorcontrollers.getExtraInforDoctorById)
    router.get('/api/get-pro-file-doctor-by-id', doctorcontrollers.getProfileDoctorById)


    router.post('/api/patient-book-appointment', patientcontrollers.postBookAppointment)
    router.post('/api/verify-book-appointment', patientcontrollers.postVerifyBookAppointment)


    router.post('/api/create-new-specialty', specialtycontrollers.createSpecialty)
    router.get('/api/get-specialty', specialtycontrollers.getAllSpecialty)
    router.get('/api/get-detail-specialty-by-id', specialtycontrollers.getDetailSpecialtyById)

    router.post('/api/create-new-clinic', cliniccontrollers.createClinic)
    router.get('/api/get-clinic', cliniccontrollers.getAllClinic)
    router.get('/api/get-detail-clinic-by-id', cliniccontrollers.getDetailClinicById)

    return app.use('/', router);
}

module.exports = initwebrouter;