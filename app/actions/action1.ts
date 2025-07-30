'use server'
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

import { cookies } from "next/headers";
import { createSession, verifySession } from "./session";

const prisma = new PrismaClient();

export type Role = 'ADMIN' | "USER"

export type Action = 'PENDING' | 'REJECTED' | 'APPROVED'

interface User {
    name: string;
    email: string;
    employeeId: string;
    department: string;
    password: string;
    role: Role
    action: Action
}

interface lab {
    labNumber: number
    labName: string
    custodianName: string
}

interface labid {
    labId: number
    
}


interface UserResponse {
    email: string;
    password: string;
}

export default async function createUser(data: User) {

    const { name, email, employeeId, department, password, role } = data

    if (!name || !email || !employeeId || !department || !password || !role) {
        throw new Error("All fields are required")
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const user = await prisma.user.createMany({
        data: {
            name,
            email,
            employeeId,
            department,
            password: hashedPassword,
            role: role,
            action: "PENDING"
        }
    })
    return user
}


export async function login(data: UserResponse) {
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

    const signedUser = {
        id: user.id,
        name: user.name,
        email: user.email,
        employeeId: user.employeeId,
        department: user.department,
        role: user.role,
        action: user.action
    }

    if (signedUser.action !== "APPROVED") {
        throw new Error("You are not authorised.")
    }

    // create session
    await createSession(signedUser);
}

export async function getUsers() {
    const users = await prisma.user.findMany({
        where: {
            role: "USER"
        }
    })


    return users.map(user => {
        return {
            id: user.id,
            name: user.name,
            email: user.email,
            employeeId: user.employeeId,
            department: user.department,
            role: user.role,
            action: user.action
        }
    })
}

export const getCurrentUser = async () => {
    const user = await verifySession();

    if (!user) {
        return null;
    }

    console.log(user.id)
    const newUser = await prisma.user.findFirst({
        where: {
            email: user.email
        }
    })

    return newUser;
}

export async function userLogout() {
    const user = await verifySession();

    if (!user) {
        return null;
    }

    const cookieStore = await cookies();
    cookieStore.delete('session');

    return { message: "Logged out successfully" };
}

export const approveUser = async ({ email }: { email: string }) => {
    const user = await prisma.user.update({
        where: {
            email: email
        },
        data: {
            action: "APPROVED"
        }
    })

    return user
}

export const rejectUser = async ({ email }: { email: string }) => {
    const user = await prisma.user.update({
        where: {
            email: email
        },
        data: {
            action: "REJECTED"
        }
    })
    return user
}

export const createLab = async (data: lab) => {

    const { labNumber, labName, custodianName } = data;

    if (!labNumber || !labName || !custodianName) {
        throw new Error("these feilds are not come here")
    }

    const resultedLab = await prisma.lab.createMany({
        data: {
            labNumber: Number(labNumber),
            labName,
            custodianName,
        },
    });

    return resultedLab;
};

export const getLabsDetail = async () => {
    const resulted = await prisma.lab.findMany()
    return resulted

}

export const deleteLab=async({labNumber}:{labNumber:number})=>{
    const deletedLab=await prisma.lab.delete({
       where:{
        labNumber:labNumber
       }
    })   
    
}

export const updateCustodianName = async ({labNumber,custodianName}:{labNumber:number,custodianName:string}) =>{
   return prisma.lab.update({
    where:{
        labNumber:labNumber
    },
    data:{
        custodianName:custodianName
    }
   })
}
