import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
}));

app.use(express.json({ limit: '15Kb' }));
app.use(express.urlencoded({ extended: true, limit: '15kb' }));
app.use(express.static('public'));
app.use(cookieParser());

const app = express();


export default app;