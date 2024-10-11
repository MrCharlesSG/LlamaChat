"use client"
import React, { useState, useRef } from "react";
import LabelInput from '@/components/server/ui/LabelInput';
import LoadingDots from '@/components/server/ui/LoadingDots';
import axios from 'axios';
import Link from 'next/link';
import { redirect, useRouter } from 'next/navigation';
import { Bounce, ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Logo from "@/components/server/ui/Logo";
 
export default function RegisterPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
 
  async function handleSubmit(event) {
    setIsLoading(true)
    event.preventDefault()
 
    const formData = new FormData(event.currentTarget)
    const credentials = {
      email : formData.get('email'),
      password : formData.get('password'),
      name: formData.get('name'),
    }

    console.log("cred " +JSON.stringify(credentials))
    
        try {
          const response = await axios.post("/api/auth/signup", credentials, {
            headers: {
              'Content-Type': 'application/json', 
            },
          })
          console.log("response :",response)
            if (response.data.success) {
              
              router.replace("/chat")
            } else {
              
                toast.error("Couldn't login");
            }
        } catch (error) {
          console.log(error)
            toast.error("Error login: " +  error.message);
        }finally{
          setIsLoading(false)
        }
    
 
    
  }
 
  return (
    <>
    <div className=" absolute items-center flex justify-center top-0 w-full">
            <Logo />
          </div>
    <div className=" w-full h-full flex-col flex justify-center items-center bg-background_secondary ">
    <h1 className=" p-2 m-2 text-2xl text-exalt_second">Register</h1>
    <form 
      className=" p-3 px-5 flex shadow-sm shadow-background_third flex-col bg-background border-2 w-2/5 min-w-96 h-fit border-background_third "
      onSubmit={handleSubmit}>
      <LabelInput 
        type={"email"}
        name={"email"}
        title={"Email"}
        placeholder={"example@example.com"}
      />
      <LabelInput
        type={"name"}
        name={"name"}
        placeholder={"Your name"}
        title={"Name"}

      />
      <LabelInput
        type={"password"}
        name={"password"}
        placeholder={"Password"}
        title={"Password"}

      />
      
      <button className="w-full shadow-sm hover:scale-105 hover:shadow-exalt-light p-2 shadow-exalt_second-light mb-3 hover:bg-exalt bg-exalt_second transition-all duration-500" type="submit">Register</button>
      <div className="flex flex-row justify-end items-center gap-3">
      <label>Already have an account:</label>
      <Link href={"/login"} className="hover:text-exalt_second text-exalt transition-colors duration-500" >Login</Link>
      </div>
      {
        isLoading &&
        <div className="fixed w-full h-full top-0 left-0 bg-background_secondary bg-opacity-70 flex justify-center items-center z-20">
              <LoadingDots />
            </div>
      }
    </form>
    </div>
    <ToastContainer
        className={" z-100"}
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
        transition={Bounce}
      />
      </>
  )
}