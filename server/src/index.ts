import dotenv from "dotenv";
dotenv.config();
import express, {Request,Response} from "express";
import cors from "cors";
import {authRouter} from "../src/routes/authRoutes"


const app = express();
const PORT = process.env.PORT || 5000 ;

// middleware
app.use(cors());
app.use(express.json());

//routes
app.use('/api', authRouter)

//TEST route
app.get('/',(req:Request,res:Response)=>{
    res.send("Task Manager API is running babyyyy")
});

app.listen(PORT, ()=>{
    console.log(`Server is running on PORT:${PORT}`)
});
