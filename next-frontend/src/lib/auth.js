import axios from "axios"
import { BACKEND_URL } from "./chat-backend-config"


export const AUTH_ENDPOINT = "/auth/api/v1/"

export async function login(loginCredentials) {
    const url = BACKEND_URL + AUTH_ENDPOINT + "login/email"
    console.log("The url" + url)
    const response = await axios.post(url, loginCredentials, {
        headers: {
          'Content-Type': 'application/json', 
        }
    })

    return response
    
}

export async function register(registerData) {
  const url = BACKEND_URL + AUTH_ENDPOINT + "register/email"
  console.log("The url" + url)
  const response = await axios.post(url, registerData, {
      headers: {
        'Content-Type': 'application/json', 
      }
  })

  return response
  
}

