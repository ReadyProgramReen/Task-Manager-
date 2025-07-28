"use client"

import {useEffect, useState} from 'react'
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthProvider';
import axios from "@/lib/axios";

//Task type structure 
interface Task {
  id: number;
  title: string;
  description: string;
  completed:boolean;
}

export default function Dashboardpage() {
    //store user data from useAuth
    const {user} = useAuth()
    //use naviagtion from useRouter
    const router = useRouter()
    //track task
    const [tasks, setTasks] = useState<Task[]>([]);
    //track new task input 
    const [newTitle, setNewTitle] = useState("");
    const [newDescription, setNewDescription] = useState("")


    useEffect(()=>{
        //if user does not exist, redirect to /login  on page mount
        if(!user){
            router.push("/login");
            return;
        }

        //fetch task for logged-in user on page mount
        const fetchTask = async ()=>{
            try {
                const res = await axios.get("/api/task",{
                    headers:{
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                });
                //get task array from fetch resonse
                const { tasks } = res.data;
                // set it in tasks
                setTasks(tasks)

            } catch (error) {
                console.error("Failed to fetch task:", error)                
            }
        }

        fetchTask()

    },[user,router])

     //prevent page flickering
     if (!user) return null

     //handle new task 
     const handleCreateTask = async(e:React.FormEvent)=>{
        //prevent defualt reload
        e.preventDefault

        try {
            //POST req to add new Task to db 
            const res = await axios.post("/api/task", {
                title: newTitle,
                description: newDescription,
            })

            //update UI display to include newly created task
            const createdTask = res.data.task;
            setTasks(prev => [...prev, createdTask]);

            //reset form 
            setNewTitle("");
            setNewDescription("");
        } catch (error) {
            console.error("Error while adding new task", error)
        }
     }

    //handle checkbox when task is completed 
    const handleToggleComplete = async (taskId:number, completed: boolean)=>{

        try {
            //PUT request to update Task in db
            const res = await axios.put(`/api/task/${taskId}`, {completed})
            //store update in DB
            const updatedTask = res.data.task;
    
            //update local state 
            setTasks((prevTasks)=>
                prevTasks.map((task)=> task.id == taskId ? {...task,completed: updatedTask.task}: task )
            )
            
        } catch (error) {
            console.error("Failed to toggle task completion:", error)
            
        }

    }

    //handle task deletion

    const handleDelete = async (taskId:number)=>{
        try {
            //DELETE request
            const res = await axios.delete(`/api/task/${taskId}`)
            //store new updated Task list 
            const withoutDeletedtasks = res.data.task;
    
            //update state
            setTasks((prevTask)=>
                prevTask.filter((task)=>task.id !== taskId )
            ) 
            
        } catch (error) {
            console.error("Failed to delete task", error)
        }

    }

  return (
    <div>
        <h1>Welcome to your dashboard, {user.name}</h1>

        {/* Field to add new task */}

        <form onSubmit={handleCreateTask}>
            <div>
                <label>Title:</label>
                <input
                type="text"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                required
                />
            </div>
            <div>
                <label>Description:</label>
                <input
                type="text"
                value={newDescription}
                onChange={(e) => setNewDescription(e.target.value)}
                required
                />
            </div>
            <button type="submit">Create Task</button>
        </form>



        {/* Display all task */}
        <h2>Your Task:</h2>
        <ul>
         {!tasks ? (
            <p>Loading tasks...</p>
            ) : tasks.length === 0 ? (
            <p>No tasks yet.</p>
            ) : (
                tasks.map((task) => (
                    <li key={task.id}>
                      <label>

                        <strong>{task.title}</strong>: {task.description}

                        <input type="checkbox" checked= {task.completed} onChange={()=>handleToggleComplete(task.id, !task.completed)} />

                        <button onClick={()=>handleDelete(task.id)} style={{ marginLeft: "10px" }}>DELETE</button>

                     </label>
                    </li>
                ) )
         )}
        </ul>
    </div>
  )
}
