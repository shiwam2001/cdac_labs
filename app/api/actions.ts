'use server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function getUsers() {
  const users = await prisma.user.findMany()
  console.log(users)
  return users
}

export type Role = 'ADMIN' | 'USER'

interface User{
  name: string
  email: string
  employeeId: string
  password: string
  role: Role
}

export async function createUser(data: User) {
  const { name,employeeId , email, password, role } = data

  if (!name || !email || !employeeId || !password || !role) {
    throw new Error("All fields are required")
  }

  const user = await prisma.user.create({
    data: {
      name,
      email,
      password,
      employeeId,
      role : role
    }
  })
  return user
      
}

export async function deleteUser(id: number) {
  if (!id) {
    throw new Error("User ID is required")
  }

  const user = await prisma.user.delete({
    where: { id }
  })
  return user
}