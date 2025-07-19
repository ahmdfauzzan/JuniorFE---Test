import express, {NextFunction, Request, Response} from 'express';
import dotenv from 'dotenv';
import 'dotenv/config';
dotenv.config({ path: `.env.${process.env.NODE_ENV}` , debug: true });

const app = express();
const cors = require('cors');

import {Routes} from "./client/route";
import {getAuthorizationHeaders, responseBuilder} from "./util/common";
import {FirebaseService} from "./lib/external/auth/firebase-client";
import {DatabaseManager} from "./lib/external/database/database";
const bodyParser = require("body-parser")
const _ = require("lodash");
const PORT = process.env.PORT || 8000;

DatabaseManager.getInstance();
console.log(`Port :`,PORT)

let corsOptions = {
    origin:  ["*"],
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
    preflightContinue: false,
    optionsSuccessStatus: 204
}

app.use(cors(corsOptions));

app.use(function (req, _ : any, next) {
    delete req.headers['content-encoding']
    next()
})
app.use(bodyParser.json({ type: 'application/json', limit: '50mb'}));
app.use(bodyParser.urlencoded({extended : true, limit: '50mb'}));

const apiRouter = express.Router();

if (process.env.AUTH_FIREBASE === 'true') {
    FirebaseService.getService().initializeFirebaseAdmin();
}

export async function setupContextForWeb(req: Request, res: Response, next: NextFunction) {
    try {
        const authorization = getAuthorizationHeaders(req)
        if (!authorization) {
            return responseBuilder(res, false, 200, "User Not Authorize");
        }
        await FirebaseService.getService().getWebFirebaseId(authorization)
        next();
    } catch (err){
        responseBuilder(res, false, 200, "Firebase ID token has expired/Invalid Token")
    }
}

_.forEach(Routes, function (value: any) {
    if (value) {
        console.log(value.method, " - ", value.route);
        const routeHandlers = [
            cors(corsOptions),
        ];
        routeHandlers.push((req: Request, res: Response, next: NextFunction) => {
            console.log("request:", req.method, " - ", req.path);
            next();
        });
        if (process.env.AUTH_FIREBASE === 'true') {
            routeHandlers.push(setupContextForWeb);
        }
        routeHandlers.push(asyncHandler(value.controller));
        apiRouter[value.method.toLowerCase()](value.route, ...routeHandlers);
    }
});

app.use('/', apiRouter);


//handling error all field should filled in
app.use((error, _req, res, _next) => {
    // @ts-ignore
    res.send(error);
})

app.use((_req, res, _next) => {
    res.send(
        {
            is_success: false,
            status_code: 404,
            message: "sorry, can't find that!",
            data: []
        }
    )
})
function asyncHandler(fn) {
    return (req, res, next) => {
        Promise.resolve(fn(req, res, next)).catch(next);
    };
}

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});



