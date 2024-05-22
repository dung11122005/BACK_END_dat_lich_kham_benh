import express from "express";
import homecontrollers from "../controllers/homecontrollers";

let router = express.Router();

let initwebrouter = (app) => {
    router.get('/', homecontrollers.gethomepage)
    router.get('/crud', homecontrollers.getCRUD)



    router.post('/post-crud', homecontrollers.postCRUD)
    router.get('/get-crud', homecontrollers.displaygetCRUD)








    return app.use('/', router);
}

module.exports = initwebrouter;