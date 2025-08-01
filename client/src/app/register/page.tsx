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
    const handleSubmit = async(e: React.FormEvent<HTMLFormElement>)=>{
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
          
        } catch (err) {
                setError("Something went wrong.");          
        }

    }


  return (
     <div className="auth-container">
      <form className='auth-form-container' onSubmit={handleSubmit}>
      <h2>Register</h2>
         <input
          type="name"
          name="name"
          placeholder="Name"
          value={formData.name}
          onChange={handleChange}
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          required
        />
        <button type="submit">Register</button>
        {error && <p style={{ color: "red" }}>{error}</p>}

        {/* navigate user to login */}
       <p onClick={() => router.push("/login")}>Already have an account? Login</p>
      </form>
    </div>
  )
}

