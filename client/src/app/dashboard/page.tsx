"use client"

import {useEffect, useState} from 'react'
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthProvider';
import axios from "@/lib/axios";
import "@/styles/dashboard.css";


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
    //tracked edits 
    const [editingTask, setEditingTask] = useState<Task | null>(null);
    const [editTitle, setEditTitle] = useState("");
    const [editDescription, setEditDescription] = useState("");


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

    //store the current task datat in editing usestate for edit
    const handleEdit=async (task:Task)=>{
        console.log("edit button")
        setEditingTask(task);
        setEditTitle(task.title);
        setEditDescription(task.description);
    }

    //edit all field in Task
    const handleUpdate = async (e:React.FormEvent)=>{
        e.preventDefault()
        if (!editingTask) return;

        try {
            //PUT request to edit all the field in DB
            const res = await axios.put(`/api/task/${editingTask.id}`,{
                title: editTitle,
                description: editDescription,
            })
    
            //store new task list 
            const updatedTask = res.data.task;
    
            //set Task state
            setTasks((prevTask)=>
            prevTask.map((task)=>task.id == updatedTask.id ? updatedTask : task)
            )
    
            //clear edit state
            setEditingTask(null);
            setEditTitle("");
            setEditDescription("");
        } catch (error) {
            
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
    <div  className='dashboard-container'>
        <h1>Welcome to your dashboard, {user.name.split("")[0].toUpperCase()}{user.name.slice(1)} !</h1>

        {/* Field to add new task */}

        <form onSubmit={handleCreateTask} className='add-task-form {
'>
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
        <ul className='task-list'>
         {!tasks ? (
            <p>Loading tasks...</p>
            ) : tasks.length === 0 ? (
            <p>No tasks yet.</p>
            ) : (
                tasks.map((task) => (
                    <li key={task.id}>
                      <span>
                        <input type="checkbox" checked= {task.completed} onChange={()=>handleToggleComplete(task.id, !task.completed)} />
                        <strong>{task.title}</strong>: {task.description}{" "}
                      </span>

                      <span>
                        <button onClick={()=>handleEdit(task)}>EDIT</button>
                        <button onClick={()=>handleDelete(task.id)} style={{ marginLeft: "10px" }}>DELETE</button>

                      </span>

                    </li>
                ) )
         )}
        </ul>

        {/* //edit task  */}
        {editingTask && (
         <div className='edit-task-inline'>
            <h3>Editing Task:</h3>
            <form onSubmit={handleUpdate}>
                <input
                type="text"
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                placeholder="Title"
                />
                <input
                type="text"
                value={editDescription}
                onChange={(e) => setEditDescription(e.target.value)}
                placeholder="Description"
                />
                <button type="submit">Update</button>
                <button type="button" className= "cancel-btn" onClick={() => setEditingTask(null)}>Cancel</button>
            </form>
        </div>
        )}
    </div>
  )
}
