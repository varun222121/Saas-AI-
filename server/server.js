import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import { clerkMiddleware, requireAuth } from '@clerk/express'
import aiRouter from './routes/aiRoutes.js';
import connectCloudinary from './configs/cloudinary.js';
import userRouter from './routes/userRoutes.js';

const app= express()
await connectCloudinary()

const allowedOrigins = [
    'http://localhost:5173',
    'http://localhost:5174',
    'https://saas-ai-1.vercel.app'
];

// Add any additional origins from environment variable
if (process.env.FRONTEND_URL) {
    allowedOrigins.push(process.env.FRONTEND_URL);
}

app.use(cors({
    origin: allowedOrigins,
    credentials: true
}))
app.use(express.json())
app.use(clerkMiddleware())

// Log all requests
app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    next();
});

app.get('/',(req, res)=> res.send('Server is Live!'))

console.log('Registering /api/ai routes...')
app.use('/api/ai', aiRouter)
app.use('/api/user', userRouter)
console.log('Routes registered!')

const PORT= process.env.PORT || 3000;

app.listen(PORT, ()=>{
    console.log('Server is running on port', PORT);
})