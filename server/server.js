import express from 'express'
import cors from "cors"
import 'dotenv/config'
import { clerkMiddleware, requireAuth } from '@clerk/express'
import aiRouter from './routes/aiRoutes.js';
import connectCloudinary from './config/cloudinary.js';
import userRouter from './routes/userRoutes.js';

const app=express();
// console.log("Publishable Key:", process.env.CLERK_PUBLISHABLE_KEY);
// console.log("Secret Key:", process.env.CLERK_SECRET_KEY);
await connectCloudinary()

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(clerkMiddleware())


app.get('/',(req,res)=>{
    return res.send('Server is live')

})



app.use('/api/ai',requireAuth(),aiRouter)
app.use('/api/user',requireAuth(),userRouter)
const PORT=process.env.PORT || 3000
app.listen(PORT,()=>console.log(`Server listen at ${PORT}`)
)