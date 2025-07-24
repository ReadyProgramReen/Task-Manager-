import { Router, Request,Response } from "express";
import { PrismaClient } from "@prisma/client";
import { authenticateToken } from "../middleware/authMiddleware";

export const taskRoutes = Router();

const prisma = new PrismaClient();


//Get all tasks for the logged-in user 
taskRoutes.get('/',authenticateToken, async (req:Request,res:Response)=>{
    //narrow types
    if(!req.user){
        return res.status(400).json({message: "Unauthorized"})
    }

    //store req.user in user varaiable 
    const user = req.user;

    try {
        //get all user task from db in newest to oldest 
        const tasks = await prisma.task.findMany({
            where: {userId: user.id},
            orderBy: {createdAt: "desc"},
        })

        //inform client that get was successful
        res.status(200).json({message : "Full task list successfully retrieved :", tasks})
    } catch (error) {
        console.error("Error fetching all task for user", error);
        res.status(500).json({message: "Server error"})
    }

})