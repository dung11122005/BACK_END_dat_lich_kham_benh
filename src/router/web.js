import express from "express";
import homecontrollers from "../controllers/homecontrollers";

let router = express.Router();

let initwebrouter = (app) => {
    router.get('/', homecontrollers.gethomepage)

    return app.use('/', router);
}

module.exports = initwebrouter;