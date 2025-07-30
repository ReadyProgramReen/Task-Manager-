"use client"

import Link from "next/link";
import { useAuth } from "@/context/AuthProvider";
import { useRouter } from "next/navigation";
import "@/styles/navbar.css"

import React from 'react'

export default function Navbar() {
    //access user data and logout 
    const { user, logout } = useAuth();
    const router = useRouter();

    //logout function button
    const handleLogout =()=>{
        //clear logout and context 
        logout();
        //reroute to login in page 
        router.push("/login");
        
    }

  return (
    <nav className="navbar">
        <ul>
        <li >
          <Link href={user? "/dashboard": "/login"}><h1 className="title">Move-Makers{">"}</h1></Link>
        </li>
        {user ? (
          <li>
            <span>Hello, {user?.name && (
              <span>
                Hello {user.name.charAt(0).toUpperCase() + user.name.slice(1)}
              </span>
            )}</span>
            <button className="logout" onClick={handleLogout}>Logout</button>
          </li>

        ) : (
          <li>
            <Link href="/login">Login</Link> | <Link href="/register">Register</Link>
          </li>
        )}
       
      </ul>
    </nav>
    
  )
}
