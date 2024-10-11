
import axios from "axios";
import { NextResponse } from 'next/server';
import { BACKEND_URL } from "@/lib/chat-backend-config";
import { getAuthHeader } from "@/lib/session";

export async function GET(req) {
  try {
    const data = await getAllMessages()
    console.log("The response: ", data)
    return NextResponse.json({data},  { status: 200 });
  } catch (error) {
    console.error('Login error:', error);

    // Devolver respuesta de error
    return NextResponse.json({ error: 'Failed to log in' }, { status: 400 });
  }
}


async function getAllMessages() {
    const url = BACKEND_URL + "/chat/all";
    const headerTitle = await getAuthHeader()
    console.log("IN ALL MESSAGE " + url + " with header " +  headerTitle)
    const response = await axios.get(url, {
        headers:{
            'Content-Type': 'application/json', 
            'Authorization': headerTitle
        }
    })
    return await response.data;
}
