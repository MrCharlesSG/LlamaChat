"use client"
import LoadingDots from '@/components/server/ui/LoadingDots';
import axios from 'axios';
import { useSearchParams, useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function GitHubCallback() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const savingSession = async  () => {
    
    const token = searchParams.get("refreshToken")
    const accessToken = searchParams.get("accessToken")

    if (token && accessToken) {
      const session = {
        token, accessToken
      }
      console.log("Got ther session ", session)
      const response = await axios.post("/api/oauth2/session", session)
      // Redirige a la página principal o al dashboard
      console.log("Redirecting to chat")
      router.push('/chat');
    }else{
      router.push("/login")
    }
  }

  useEffect(() => {
    savingSession()
  }, []);

  return <div className=" w-full h-full flex justify-center items-center">
    <LoadingDots 
      text={"Authenticating"}
    />
  </div>;
}
