import axios from "axios";
import { NextResponse } from 'next/server';
import { BACKEND_URL } from "@/lib/chat-backend-config";
import { getAuthHeader } from "@/lib/session";

export async function POST(req) {
  try {
    const body = await req.json();


    const data = await promptMessage(body.message);

    
    // Devolver respuesta de éxito
    
    return NextResponse.json({ data},  { status: 200 });
  } catch (error) {
    console.error('Error Prompting the chat:', error);

    // Devolver respuesta de error
    return NextResponse.json({ error: 'Failed to log in' }, { status: 400 });
  }
}



async function promptMessage(message) {
    const headerTitle = await getAuthHeader()
    const response = await axios.post(BACKEND_URL + "/chat", {message}, {
        headers:{
            'Content-Type': 'application/json', 
            'Authorization': headerTitle
        }
    })

    return response.data
    
}


export async function GET(req) {
  try {
    const headerTitle = await getAuthHeader()


    const response = await axios.get(BACKEND_URL + "/chat", {
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

