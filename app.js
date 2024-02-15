import express from 'express';
import path from 'path';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import sessions from 'express-session';
import apiv3Router from './routes/api/v3/apiv3.js'
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import models from './models.js'
import WebAppAuthProvider from 'msal-node-wrapper'

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const authConfig = {
    auth: {
        clientId: "15decf37-f09f-47c0-b050-c3876ca075cc",
        authority: "https://login.microsoftonline.com/f6b6dd5b-f02f-441a-99a0-162ac5060bd2",
        clientSecret: "mHq8Q~TH1TOzkmW-BFjZhBMo6_nCkx9HYtgvtcY4",
        // redirectUri: "websharer.kritivajjhula.me/redirect", //note: you can explicitly make this "localhost:3000/redirect" or "examplesite.me/redirect"
        redirectUri: "/redirect", //note: you can explicitly make this "localhost:3000/redirect" or "examplesite.me/redirect"

    },
    system: {
        loggerOptions: {
            loggerCallback(loglevel, message, containsPii) {
                console.log(message);
            },
            piiLoggingEnabled: false,
            logLevel: 3,
        }
    }
};


var app = express();
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

const oneDay = 1000 * 60 * 60 * 24
app.use(sessions({
    secret: "this is some secret key I am making up v45v;lkjgdsal;nwqt49asglkn",
    saveUninitialized: true,
    cookie: { maxAge: oneDay },
    resave: false
}))

const authProvider = await WebAppAuthProvider.WebAppAuthProvider.initialize(authConfig);
app.use(authProvider.authenticate());

// middleware to share model with api handlers
app.use((req, res, next) => {
    req.models = models;
    next()
})

// app.use('/api/v2', apiv2Router);
app.use('/api/v3', apiv3Router);


app.use((req, res, next) => {
    console.log("session info:", req.session)
    next();
})


app.get(
    '/signin',
    (req, res, next) => {
        return req.authContext.login({
            postLoginRedirectUri: "/", // redirect here after login
        })(req, res, next);
    }
);

app.get(
    '/signout',
    (req, res, next) => {
        return req.authContext.logout({
            postLogoutRedirectUri: "/", // redirect here after logout
        })(req, res, next);
    }
);

app.use(authProvider.interactionErrorHandler());

export default app;
