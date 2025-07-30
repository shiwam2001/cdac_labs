"server only"

import jwt from "jsonwebtoken";
import { Role } from './action1';
import { redirect } from 'next/navigation';
import { cookies } from "next/headers";


interface User {
    name: string;
    email: string;
    employeeId: string;
    department:string;
    role: Role;
    action:string
    id:number
}

export async function createSession(signedUser: User) {
    // create jwt token 
    const token = jwt.sign(
        signedUser,
        process.env.JWT_SECRET!,
        {
            expiresIn: '1d'
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

    if (signedUser.role === 'ADMIN') {
        redirect("/admin")
    }else if (signedUser.role === 'USER') {

        redirect("/user")
    }
}


export async function verifySession() {
    const cookieStore = await cookies()
    const token = cookieStore.get('session')?.value

    if (!process.env.JWT_SECRET) {
        throw new Error('JWT_SECRET is not defined in the environment variables');
    }

    if (!token) {
        return null
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET)


    if (typeof decoded === 'object' && 'email' in decoded) {
        return decoded as User;
    }

    return null;
}



