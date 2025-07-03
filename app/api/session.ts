"server only"
import { cookies } from 'next/headers'
import jwt from "jsonwebtoken";
import { Role } from './action1';
import { redirect } from 'next/navigation';

interface User {
    name: string;
    email: string;
    employeeId: string;
    role: Role
}

export async function createSession(signedUser:User) {
    // create jwt token
    const token = jwt.sign(
        signedUser,
        process.env.JWT_SECRET!,
        {
            expiresIn:'1h'
        }
    )
    // set jwt token in cookies
    const new_cookies = await cookies()
    new_cookies.set('session', token, {
        httpOnly: true,
        path: '/',
        secure: true,
        maxAge: 60 * 60 * 24, // 1 day
    })

    redirect("/")
}


export async function verifySession(){
  const cookieStore = await cookies()
  const token = cookieStore.get('session')?.value
    if (!process.env.JWT_SECRET) {
        throw new Error('JWT_SECRET is not defined in the environment variables');
    }
    if (!token) {
        throw new Error('No session token found');
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    
    if (typeof decoded === 'object' && 'email' in decoded) {    
        return decoded as User;
    }
    return null;
}

