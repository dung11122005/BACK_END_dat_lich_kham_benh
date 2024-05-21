import express from "express"
import bodyParser from "body-parser"
import viewEngine from "./config/viewengine"
import initwebrouter from "./router/web"
import connectDb from "./config/connectDB"

require('dotenv').config();
let app = express();
//app.use(express.static(__dirname + '/public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }))
viewEngine(app);
initwebrouter(app);
connectDb.connectDb();


let port = process.env.PORT || 6000;
app.listen(port, () => {
    console.log("backend nodejs is runing in the port: " + port);
})