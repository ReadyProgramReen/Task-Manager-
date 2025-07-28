"use client"

import Link from "next/link";
import { useAuth } from "@/context/AuthProvider";
import { useRouter } from "next/navigation";

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
        <nav style={{ display: "flex", justifyContent: "space-between", padding: "1rem", background: "#eee" }}>
      <div>
        <Link href="/dashboard">MoveMaker</Link>
      </div>
      <div>
        {user ? (
          <>
            <span style={{ marginRight: "1rem" }}>Hello, {user.name}</span>
            <button onClick={handleLogout}>Logout</button>
          </>
        ) : (
          <>
            <Link href="/login">Login</Link> | <Link href="/register">Register</Link>
          </>
        )}
      </div>
    </nav>
    
  )
}
