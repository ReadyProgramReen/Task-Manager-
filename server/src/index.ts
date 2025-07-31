import dotenv from "dotenv";
dotenv.config();
import express, {Request,Response} from "express";
import cors from "cors";
import {authRouter} from "../src/routes/authRoutes"
import { taskRoutes } from "./routes/taskRoutes";


const app = express();
const PORT = process.env.PORT || 5000 ;

// middleware
app.use(cors({
 origin: ["http://localhost:3000", "https://move-makers.netlify.app"],
  credentials: true, 
}));
app.use(express.json());

//routes middleware
app.use('/api', authRouter);
app.use('/api/task', taskRoutes);

//TEST route
app.get('/',(req:Request,res:Response)=>{
    res.send("Task Manager API is running babyyyy")
});

app.listen(PORT, ()=>{
    console.log(`Server is running on PORT:${PORT}`)
});
