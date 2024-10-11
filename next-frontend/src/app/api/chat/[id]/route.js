import axios from "axios";
import { NextResponse } from 'next/server';
import { BACKEND_URL } from "@/lib/chat-backend-config";
import { getAuthHeader } from "@/lib/session";

export async function GET(req) {
    try {
        const chatId = extractID(req)
      const headerTitle = await getAuthHeader()
        
      const url = BACKEND_URL + "/chat/" + chatId;
      console.log("The URL " +url)
  
      const response = await axios.get(url, {
        headers:{
            'Content-Type': 'application/json', 
            'Authorization': headerTitle
        }
    })
  
      const data = response.data
            
      return NextResponse.json({ data},  { status: 200 });
    } catch (error) {
      console.error('Login error:', error);
  
      return NextResponse.json({ error: 'Failed to log in' }, { status: 400 });
    }
  }



  export async function POST(req) {
    try {
        const chatId = extractID(req)
        const body = await req.json();  
        const message = body.message;
        const headerTitle = await getAuthHeader()
        
        const url = BACKEND_URL + "/chat/" + chatId;
        console.log("The URL " +url)
        console.log("An the body ", req)
  
        const response = await axios.post(url, {message}, {
          headers:{
              'Content-Type': 'application/json', 
              'Authorization': headerTitle
          }
      })
    
  
      const data = response.data
      
      // Devolver respuesta de éxito
      
      return NextResponse.json({ data},  { status: 200 });
    } catch (error) {
      console.error('Login error:', error);
  
      // Devolver respuesta de error
      return NextResponse.json({ error: 'Failed to log in' }, { status: 400 });
    }
  }


const extractID = (req) => {
        const urlReq = new URL(req.url);
        console.log("IS the urle s ", urlReq)
        const pathSegments = urlReq.pathname.split("/");
        const chatID = pathSegments[pathSegments.length - 1]
        console.log("IS the ID", chatID)
        return chatID;
}



export async function DELETE(req) {
  try {
      const chatId = extractID(req)
      const headerTitle = await getAuthHeader()
      
      const url = BACKEND_URL + "/chat/" + chatId;
      console.log("The URL for deleting" +url)
      console.log("An the body ", req)

      const response = await axios.delete(url, {
        headers:{
            'Content-Type': 'application/json', 
            'Authorization': headerTitle
        }
    })
    
    return NextResponse.json( { status: 200 });
  } catch (error) {
    console.error('Login error:', error);

    // Devolver respuesta de error
    return NextResponse.json({ error: 'Failed to deleting' }, { status: 400 });
  }
}