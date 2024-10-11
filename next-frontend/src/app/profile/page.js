"use client"
import LoadingDots from '@/components/server/ui/LoadingDots';
import Logo from '@/components/server/ui/Logo';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from "react";
import { IoArrowBackSharp } from "react-icons/io5";
import { Bounce, ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

 
export default function ProfilePage() {
  const router = useRouter()
  const [isLoggingOut, setIsLoggingOut] = useState(false)
  const [userInfo, setUserInfo] = useState({
    "name":"Searching For It",
    "email":"searching@for.it"
  })

  const logOut = async () => {
    try {
      setIsLoggingOut(true)
      await axios.post("/api/auth/logout")


      router.push("/")
    } catch (error) {
      setIsLoggingOut(false)
      toast.error("Couldn't log out. Try again.")
    }
  }


 
  const fetchUserInfo = async () => {
    try {
      const response = await axios.get("/api/auth/profile")
      const userInfoResponse = response.data.data
      setUserInfo(userInfoResponse)
    } catch (error) {
      toast.error("Something went wrong fetching your profile. Try to reload.")
    }
  }

  useEffect(() => {
    fetchUserInfo()
  }, [])

  return (
    <>
    <div className=" absolute items-center flex justify-center top-0 w-full">
            <Logo />
          </div>
      <div className="w-full h-full flex-col flex justify-center items-center bg-background_secondary">
        <div className="w-2/5 min-w-96 flex flex-row items-center justify-center relative">
          
          
          <button 
            title="Go Back to Chat"
            className="bg-background absolute hover:bg-background_secondary shadow-sm shadow-background_third top-4 left-0 border-2 border-background_third w-fit h-fit p-1"
            onClick={() => {
              router.back()
            }}
          >
            <IoArrowBackSharp className="text-xl text-white" />
          </button>
  
          <h1 className="abs p-2 m-2 text-2xl text-exalt">Your Profile</h1>
        </div>
  
        <div className="p-3 px-5 gap-3 flex shadow-sm shadow-background_third flex-col bg-background border-2 w-2/5 min-w-96 h-fit border-background_third">
          <section>
            <label className=" text-white text-xl mb-1">Name</label>
            <p className="text-exalt shadow-sm shadow-background_third mb-5 p-2 bg-transparent">
              {userInfo.name}
            </p>
          </section>
  
          <section>
            <label className=" text-white text-xl mb-1">Email</label>
            <p className="text-exalt shadow-sm shadow-background_third mb-5 p-2 bg-transparent">
              {userInfo.email}
            </p>
          </section>
  
          <button
            className="w-full  shadow-sm hover:scale-105 shadow-danger-400 bg-danger_color hover:bg-danger-600 p-2 transition-all duration-500"
            onClick={logOut}
          >
            log out
          </button>
  
          {isLoggingOut && <LoadingDots text={"logging out"} />}
        </div>
      </div>
  
      <ToastContainer
        className={"z-100"}
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
  );  
}