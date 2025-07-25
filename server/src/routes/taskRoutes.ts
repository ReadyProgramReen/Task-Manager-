import { Router, Request,Response } from "express";
import { PrismaClient } from "@prisma/client";
import { authenticateToken } from "../middleware/authMiddleware";

export const taskRoutes = Router();

const prisma = new PrismaClient();

interface TypedRequest extends Request {
  user?: {
    id: number;
    email: string;
    iat: number;
    exp: number;
  };
}


//Get all tasks for the logged-in user in DB 
taskRoutes.get('/',authenticateToken, async(req:TypedRequest,res:Response)=>{
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

//Added a new task to the DB for the logged-in user 
taskRoutes.post("/", authenticateToken, async (req:TypedRequest, res:Response)=>{
    //check if user is authorized 
    if(!req.user){
        return res.status(401).json({message: "Unauthorized"})
    }

    //store title and content from request body
    const {title , description} = req.body;

   //store user id 
   const userId = req.user.id;

   try {

    //check if title field is empty
    if(!title){
        return res.status(400).json({message: "Title is required"})
    }

    //create new task in Task model
    const newTask = await prisma.task.create({
        data:{
            title,
            description,
            userId,
        }
    });

    //inform client of successful task creation
    res.status(201).json({
        message:"Task created successfully",
        task:newTask,
    })

   } catch (error) {
    console.error("Error creating task:", error);
    res.status(500).json({message: "Server error"})
    
   }



})

//Update task for logged in user in DB 
taskRoutes.put("/:id", authenticateToken, async (req:TypedRequest, res:Response)=>{
     //check if user is authorized 
    if(!req.user){
        return res.status(401).json({message: "Unauthorized"})
    }

    //access id from req.params
    const {id} = req.params;

    //store updated form fields from req.body
    const {title,description,completed} = req.body;

    //store user id 
    const currentUserId = req.user.id;


    try {
        //Make sure task exist and belongs to the logged in user 
        const existingTask = await prisma.task.findUnique({
            where: {id: parseInt(id)},
        });

        //if task does not exist or doesnt belong to the logged in user send message to client side 
        if(!existingTask || existingTask.userId !== currentUserId){
            return res.status(400).json({message : "Task not found"})
        };

        //Update the current task in the Task model db
        const updatedTask = await prisma.task.update({
            where: {id: parseInt(id)},
            data:{
                title,
                description,
                completed,
            }
        })


        //send message to client and the updated task
        res.status(200).json({
            message : "Task updated ",
            task : updatedTask
        })
        
    } catch (error) {
        console.error("Error updating task :", error);
        res.status(500).json({message:"Server error"});
    }
})