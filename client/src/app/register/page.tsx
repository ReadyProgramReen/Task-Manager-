"use client";

import {useState} from 'react';
import axios from "@/lib/axios";
import { useRouter } from "next/navigation";


export default function RegisterPage(){
    const router =useRouter()
    //store email and password
    const [formData, setFormData]= useState({
        name:"",
        email:"",
        password:"",
    })
    //store error message 
    const [error, setError] = useState("");

    //handle the changes on each form field
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

    //handle submit 
    const handleSubmit = async(e:React.FormEvent)=>{
        //prevents page reload
        e.preventDefault();

        try {
          //POST request for Registration
          const res = await axios.post("/api", formData);
          //check if it was successfully created 
          if(res.status === 201){
            //redirect to login page
            router.push("/login")
          }
          
        } catch (err:any) {
                setError(err.response?.data?.error || "Something went wrong.");          
        }

    }


  return (
     <div>
      <h1>Register</h1>
      <form onSubmit={handleSubmit}>
         <input
          type="name"
          name="name"
          placeholder="Name"
          value={formData.name}
          onChange={handleChange}
          required
        />
        <br />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          required
        />
        <br />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          required
        />
        <br />
        <button type="submit">Register</button>
        {error && <p style={{ color: "red" }}>{error}</p>}
      </form>
    </div>
  )
}

