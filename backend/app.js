import express from 'express';
import morgan from 'morgan';
import dbconnection from './db/db.js';
import cookieParser from 'cookie-parser';
import cors from 'cors';
dbconnection();

const app = express();

// it will log all the requests in the console
app.use(morgan('dev'));

// to use json and urlencoded 
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors())

// to use routes
app.get('/', (req, res) => {
    res.send('Hello World');
});



export default app;