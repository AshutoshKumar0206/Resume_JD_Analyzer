import express, { Request, Response, Application } from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
dotenv.config();
import authRouter from './routes/auth.route';
import connectDB from './config/database';


const app: Application = express();
const PORT = process.env.PORT || 5000;

// --- Middleware ---
app.use(express.json());
app.use(cookieParser());
connectDB();

// Essential for Cross-Origin Cookies
app.use(cors({
    origin: "http://localhost:3000",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
}));

app.get('/', (req: Request, res: Response) => {
    res.status(200).json({
        message: "Nexus Tech API is Online",
        version: "1.0.0",
        uptime: process.uptime()
    });
});

app.use('/api/auth', authRouter);
app.listen(PORT, () => {
    console.log(`⚡️[server]: Server is running at PORT ${PORT}`);
});