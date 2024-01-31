import express from 'express';
import path from 'path';
import cookieParser from 'cookie-parser';
import logger from 'morgan';

import apiv1Router from './routes/api/v1/apiv1.js'

import { fileURLToPath } from 'url';
import { dirname } from 'path';
import models from './models.js'

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// middleware to share model with api handlers
app.use((req, res, next) => {
    req.models = models;
    next()
})

app.use('/api/v1', apiv1Router);

export default app;
