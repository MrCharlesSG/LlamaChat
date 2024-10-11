"use client"
import LabelInput from '@/components/server/ui/LabelInput';
import LoadingDots from '@/components/server/ui/LoadingDots';
import Logo from "@/components/server/ui/Logo";
import Modal from "@/components/server/ui/Modal";
import axios from 'axios';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from "react";
import { FaGithubAlt } from "react-icons/fa";
import { Bounce, ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

 
export default function LoginPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  async function handleSubmit(event) {
    setIsLoading(true)
    event.preventDefault()
 
    const formData = new FormData(event.currentTarget)
    const credentials = {
      email : formData.get('email'),
      password : formData.get('password')
    }

    console.log("cred " +JSON.stringify(credentials))
    
        try {
          await axios.post("/api/auth/login", credentials, {
            headers: {
              'Content-Type': 'application/json', 
            },
          })
          console.log("LOGIN has finsih")
            
          
            
        } catch (error) {
          console.log(error)
            toast.error("Error login: " +  error.message);
            setIsLoading(false)
            return;
        }finally{
          setIsLoading(false)
        }
    
        router.push("/chat")
        console.log("Dident push")
    
  }
 
  return (
    <>
    <div className=" absolute items-center flex justify-center top-0 w-full">
            <Logo />
          </div>
    <div className=" w-full h-full flex-col flex justify-center items-center bg-background_secondary ">
    <h1 className=" p-2 m-2 text-2xl text-exalt">Login</h1>
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
        type={"password"}
        name={"password"}
        placeholder={"Password"}
        title={"Password"}

      />
      <button className="w-full shadow-sm hover:scale-105 shadow-exalt-light p-2 hover:shadow-exalt_second-light mb-3 bg-exalt hover:bg-exalt_second transition-all duration-500" type="submit">Login</button>
      <hr className="bg-background_third border-background_third" />
      <button
      type="button"
        className=" w-full bg-background_secondary my-3 flex justify-center p-2 items-center border-2 border-background_third shadow-sm shadow-background_third hover:scale-105 hover:bg-transparent transition-all duration-500"
        onClick={
          () => {
            const redirectUri = encodeURIComponent(window.location.origin + "/oauth/callback/github"); 
            
            window.location.href = `http://localhost:1244/oauth2/authorization/github?redirect_uri=${redirectUri}`;
          }
        }
      >
        <FaGithubAlt />
        <p>Try with Gihub</p>
      </button>
      <div className="flex flex-row justify-end items-center gap-3">
      
      <label>Dont have an account:</label>
      <Link href={"/signup"} className="text-exalt_second hover:text-exalt transition-colors duration-500" >Register</Link>
      
      </div>
      {
        isLoading &&
              <Modal>
              <LoadingDots />
              </Modal>
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