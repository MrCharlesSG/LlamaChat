import axios from "axios";
import { NextResponse } from 'next/server';
import { BACKEND_URL } from "@/lib/chat-backend-config";
import { deleteSession, getAuthHeader } from "@/lib/session";


export async function POST(req) {
    try {
      const headerTitle = await getAuthHeader()
  
  
      const response = await axios.post(BACKEND_URL + "/auth"+ "/api/v1/logout",{}, {
        headers:{
            'Content-Type': 'application/json', 
            'Authorization': headerTitle
        }
    })

      await deleteSession()
  
      const data = response.data
      
      return NextResponse.json({ data},  { status: 200 });
    } catch (error) {
      console.error('Log out error:', error);
  
      // Devolver respuesta de error
      return NextResponse.json({ error: 'Failed to log out' }, { status: 400 });
    }
  }