import { serialize } from 'cookie'
import { cookies } from 'next/headers';
import crypto from 'crypto';
import { BACKEND_URL } from './chat-backend-config';
import axios from 'axios';

// Helper to encode string to ArrayBuffer
const encodeText = (text) => new TextEncoder().encode(text);

// Helper to decode ArrayBuffer to string
const decodeText = (buffer) => new TextDecoder().decode(buffer);

// Key for AES encryption
const secretKey = Buffer.from(process.env.SECRET_KEY, 'base64'); 


if (!secretKey || secretKey.length !== 32) {
    throw new Error("SECRET_KEY must be defined and be 32 characters long");
}

// Convert secret key to CryptoKey format for Web Crypto API
async function getKey() {
    return await crypto.subtle.importKey(
        'raw', 
        encodeText(secretKey), 
        { name: 'AES-CBC' }, 
        false, 
        ['encrypt', 'decrypt']
    );
}

// Encryption function
export const encrypt = async (sessionData) => {
    /*const key = await getKey();
    const iv = new Uint8Array(16); // AES-CBC requires a 16-byte IV
    const encrypted = await crypto.subtle.encrypt(
        { name: 'AES-CBC', iv },
        key,
        encodeText(JSON.stringify(sessionData))
    );
    return Buffer.from(encrypted).toString('hex'); // Return hex string*/
    return JSON.stringify(sessionData)
};

// Decryption function
export const decrypt = async (encryptedSessionData) => {
    /*const key = await getKey();
    const iv = new Uint8Array(16); // AES-CBC requires the same IV
    const encryptedData = Buffer.from(encryptedSessionData, 'hex');
    const decrypted = await crypto.subtle.decrypt(
        { name: 'AES-CBC', iv },
        key,
        encryptedData
    );
    return JSON.parse(decodeText(decrypted)); // Return decrypted session as JSON
    */
   console.log("Decrypting ",  encryptedSessionData)
   return JSON.parse(encryptedSessionData)
};


export async function saveSession(responseData, res) {
    const sessionData = {
        token:responseData.token,
        accessToken: responseData.accessToken,
        lastRefresh: Date.now()
    }
    const encryptedSessionData = await encrypt(sessionData)
    console.log("THE saved value ", encryptedSessionData)
    cookies().set('session', encryptedSessionData, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 604800, 
        path: '/',
    })
}

export async function deleteSession() {
    cookies().delete('session')
}


export async function refreshAccessToken(refreshToken) {
    try {
        const response = await fetch(BACKEND_URL + '/auth/api/v1/refreshToken', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${refreshToken}`, // Attach the refresh token in headers
            },
        });

        if (!response.ok) {
            throw new Error('Failed to refresh token');
        }

        return await response.json(); // Response should contain new tokens
    } catch (error) {
        console.error('Error refreshing access token:', error);
        return null;
    }
}


const isAccessTokenExpired = (session) => {
    const currentTime = Date.now();
    const accessTokenExpiration = session.lastRefresh + 600000; // 10 minutes (600000 ms)
    return currentTime > accessTokenExpiration;
};

export async function getAuthHeader() {
    const cookie = cookies().get('session')?.value;
    console.log(cookie)
    if (!cookie) {
        throw new Error('No session available. Please log in.');
    }

    const session = await decrypt(cookie);

    if (!session || !session.accessToken) {
        throw new Error('No access token found. Please log in.');
    }

    // Check if the accessToken is expired
    if (isAccessTokenExpired(session)) {
        console.log('Access token expired. Refreshing...');

        // Attempt to refresh the token
        const refreshResponse = await axios.post(BACKEND_URL+"/auth/api/v1/refreshToken", {"token":session.token});
        if (refreshResponse.status!=200) {
            throw new Error('Failed to refresh access token. Please log in again.');
        }

        const refreshedData = refreshResponse.data;

        // Save the new session with the refreshed tokens
        await saveSession(refreshedData, cookies);

        // Return the new Authorization header with the new accessToken
        return `Bearer ${refreshedData.accessToken}`;
    }

    // Return the Authorization header with the existing accessToken
    return `Bearer ${session.accessToken}`;
}
