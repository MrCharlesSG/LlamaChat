import axios from "axios";
import { NextResponse } from 'next/server';
import { BACKEND_URL } from "@/lib/chat-backend-config";
import { getAuthHeader } from "@/lib/session";

export async function POST(req) {
  try {
    const body = await req.json();
    const title = body.title
    console.log("In toute ", title)
    const headerTitle = await getAuthHeader()
    const response = await axios.post(BACKEND_URL + "/chat/new-chat", {title}, {
        headers:{
            'Content-Type': 'application/json', 
            'Authorization': headerTitle
        }
    })

    console.log("response of new chat in route:",response)
    const data = response.data

    
    // Devolver respuesta de éxito
    
    return NextResponse.json({ data},  { status: 200 });
  } catch (error) {
    console.error('Login error:', error);

    // Devolver respuesta de error
    return NextResponse.json({ error: 'Failed to log in' }, { status: 400 });
  }
}
