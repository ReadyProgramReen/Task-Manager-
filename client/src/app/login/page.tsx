"use client"

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthProvider";
import axios from "@/lib/axios";


export default function LoginPage(){
    const router = useRouter();
    //access to login context
    const {login} = useAuth();
    //track state of email , password and error
    const [email,setEmail] = useState("");
    const [password , setPassword] = useState("");
    const [error,setError] = useState("");

    //handle submit function
    const handleSubmit = async(e:React.FormEvent)=>{
        //prevent page reload
        e.preventDefault()

        try {
            // //POST request to the backend with email and password 
             const res = await axios.post("/api/login", {
                email,
                password,
            });

            //save user login to AuthProvider
             login(res.data.user, res.data.token)
            //redirect user to dashboard and 
            router.push("/dashboard");

        } catch (error) {
            setError("Something went wrong, please try again.")
        }

    };

    return(
        <div>
            <h2>Login</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="">Email:</label>
                    <input type="email" 
                    value={email}
                    onChange={e=>setEmail(e.target.value) }
                    />
                </div>

                <div>
                    <label htmlFor="">Password:</label>
                    <input type="Password" 
                    value={password}
                    onChange={e=>setPassword(e.target.value) }
                    />
                </div>

                {/* error message */}
                {error && <p className="error-message">{error}</p>}

                <button type="submit" className="submit-button">Login</button>

                
            </form>
        </div>
    )


}
