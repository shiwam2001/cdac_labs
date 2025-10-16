"use server";

import { PrismaClient } from "@prisma/client";
import { revalidatePath } from "next/cache";

const prisma = new PrismaClient();

export const createDepartment = async ({
  department_Name,
}: {
  department_Name: string;
}) => {
  if (!department_Name) return new Error("department not comes here");

  revalidatePath("/admin/laboratory")
  return await prisma.department.createMany({
    data: {
      department_Name,
    },
  });
};
export const getDepartmentDetail = async () => {
  return await prisma.department.findMany();
};
export const getLabsOfDepartment = async (departmentId: Number) => {
  return await prisma.lab.findMany({
    where: {
      departmentId: Number(departmentId),
    },
  });
};
export const assignLab = async (email: string, labId: number) => {
  if (!email || !labId) {
    throw new Error("All fields are reqiured.");
  }
  revalidatePath('admin/laboratory')
  return await prisma.assignedLab.createMany({
    data: {
      email,
      labId,
    },
  });
};
export const getCustodianUsers = async () => {
  return await prisma.user.findMany({
    where: {
      role: "CUSTODIAN",
    },
  });
};
export async function getApproveUsers() {
    const users = await prisma.user.findMany({
        where:{
            role:"USER",
            action:"APPROVED"
        },
        include:{
          assignedLabs:{
            include:{
              lab:true,
            }
          },
          department:true,    
      }
    })
    return users
}