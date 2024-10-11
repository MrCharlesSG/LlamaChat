import axios from "axios";
import { NextResponse } from 'next/server';
import { BACKEND_URL } from "@/lib/chat-backend-config";
import { getAuthHeader } from "@/lib/session";


export async function GET(req) {
    try {
      const headerTitle = await getAuthHeader()
  
  
      const response = await axios.get(BACKEND_URL + "/auth/api/v1/user-info", {
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