import express from "express"
import bodyParser from "body-parser"
import viewEngine from "./config/viewengine"
import initwebrouter from "./router/web"
import connectDb from "./config/connectDB"

require('dotenv').config();
let app = express();


// Add headers before the routes are defined
app.use(function (req, res, next) {

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);


    // Pass to next layer of middleware
    next();
});


//app.use(express.static(__dirname + '/public'));
// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));


viewEngine(app);
initwebrouter(app);
connectDb.connectDb();
let port = process.env.PORT || 6000;


app.listen(port, () => {
    console.log("backend nodejs is runing in the port: " + port);
})