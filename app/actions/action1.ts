'use server'
import { PrismaClient} from "@prisma/client";
import bcrypt from "bcryptjs";

import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { createSession, verifySession } from "./session";

const prisma = new PrismaClient();

export type Role = 'ADMIN' | "USER"

interface User {
    
    name: string;
    email: string;
    employeeId: string;
    password: string;
    role: Role
}

interface UserResponse {
    email: string;
    password: string;
}

export default async function createUser(data:User){

    const {name, email, employeeId, password, role} =  data

    if (!name || !email || !employeeId || !password || !role ){
        throw new Error("All fields are required")
    }

    const hashedPassword = await bcrypt.hash(password,10)


    const user = await prisma.user.create({
        data:{
            name,
            email,
            employeeId,
            password: hashedPassword,
            role:role
        }
    })
    return user

      
}


export async function login(data:UserResponse) {
    const { email, password } = data;

    if (!email || !password) {
        throw new Error("Email and password are required");
    }

    const user = await prisma.user.findUnique({
        where: { email }
    });

    if (!user) {
        throw new Error("User not found");
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
        throw new Error("Invalid password");
    }

    if (!user.is_approved){
        throw new Error("User not approved by admin");
    }

    const signedUser = {
        name: user.name,
        email: user.email,
        employeeId: user.employeeId,
        role: user.role
    }

    // create session
    await createSession(signedUser);
    
}

export async function getUsers() {
  const user = verifySession();

  if (!user) {
    throw new Error("Unauthorized");
  }

  const users = await prisma.user.findMany()
    

  return users
}
 
// export async function getUserName(){
//     const user = await verifySession();
    
//     if (!user) {
//         throw new Error("Unauthorized");
//     }
    
//     return user.name;
// }


export const getCurrentUser = async () => {
    const user = await verifySession();

    if (!user) {
        return null;
    }

    return user;
}

export async function userLogout() {
    const cookieStore = await cookies();
    cookieStore.delete('session');

    return { message: "Logged out successfully" };
}


























