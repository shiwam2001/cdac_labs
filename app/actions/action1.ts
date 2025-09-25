"use server";
import { PrismaClient, Role } from "@prisma/client";
import bcrypt from "bcryptjs";

import { cookies } from "next/headers";
import { createSession, verifySession } from "./session";
import { revalidatePath } from "next/cache";

const prisma = new PrismaClient();

export type Action = "PENDING" | "REJECTED" | "APPROVED";

interface User {
  name: string;
  email: string;
  employeeId: string;
  departmentId: number;
  password: string;
  role: Role | undefined;
  action: Action;
}

export interface lab {
  labNumber: number;
  departmentId: number;
  labName: string;

  custodianId: string;
}

interface UserResponse {
  email: string;
  password: string;
}

type LoginResponse = {
  success: boolean;
  message: string;
  user?: any;
};

export default async function createUser(data: User) {
  const { name, email, employeeId, departmentId, password, role } = data;

  if (!name || !email || !employeeId || !departmentId || !password || !role) {
    throw new Error("All fields are required");
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await prisma.user.createMany({
    data: {
      name,
      email,
      employeeId,
      departmentId,
      password: hashedPassword,
      role: role,
      action: "PENDING",
    },
  });
  return user;
}

export async function login(data: UserResponse) {
  const { email, password } = data;

  if (!email || !password) {
    return { success: false, message: "Email and password are required" };
  }

  const user = await prisma.user.findUnique({
    where: { email },
    include: {
      department: true,
    },
  });

  if (!user) {
    return { success: false, message: "User not found" };
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    return { success: false, message: "Invalid password" };
  }

  const signedUser = {
    id: user.id,
    name: user.name,
    email: user.email,
    employeeId: user.employeeId,
    department: user.departmentId,
    departmentName: user.department.department_Name,
    role: user.role,
    action: user.action,
  };

  if (signedUser.role === "USER" && signedUser.action !== "APPROVED") {
    return { success: false, message: "You are not authorised." };
  }

  // create session
  await createSession(signedUser);
}

export async function getUsers() {
  const users = await prisma.user.findMany({
    where: {
      role: {
        in: ["USER", "CUSTODIAN"],
      },
    },
    include: {
      department: true,
    },
  });

  return users.map((user) => {
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      employeeId: user.employeeId,
      department: user.department,
      departmentName: user.department?.department_Name,
      role: user.role,
      action: user.action,
    };
  });
}

export const getCurrentUser = async () => {
  const user = await verifySession();

  if (!user) {
    return null;
  }

  return await prisma.user.findFirst({
    where: {
      email: user.email,
    },
    select: {
      id: true,
      employeeId: true,
      name: true,
      email: true,
      departmentId: true,
      role: true,
      action: true,
      createdAt: true,
      department: {
        select: {
          departmentId: true,
          department_Name: true,
          createdAt: true,
        },
      },
      assignedLabs: {
        include: {
          lab: {
            select: {
              labId: true,
              labName: true,
              custodian: true,
              department: true,
            },
          },
        },
      },
    },
  });
};

export async function userLogout() {
  const user = await verifySession();

  if (!user) {
    return null;
  }

  const cookieStore = await cookies();
  cookieStore.delete("session");

  return { message: "Logged out successfully" };
}

export const approveUser = async ({ email }: { email: string }) => {
  const user = await prisma.user.update({
    where: {
      email: email,
    },
    data: {
      action: "APPROVED",
    },
  });

  return user;
};

export const rejectUser = async ({ email }: { email: string }) => {
  const user = await prisma.user.update({
    where: {
      email: email,
    },
    data: {
      action: "REJECTED",
    },
  });
  return user;
};

export const createLab = async (data: lab) => {
  const { labNumber, labName, departmentId, custodianId } = data;

  if (!labName || !custodianId) {
    throw new Error("these feilds are not come here");
  }

  const resultedLab = await prisma.lab.create({
    data: {
      labNumber: Number(labNumber),
      departmentId,
      labName,
      custodianId,
    },
  });

  revalidatePath("/admin/laboratory");

  return resultedLab;
};

export const getLabsDetail = async () => {
  const resulted = await prisma.lab.findMany({
    include: {
      department: true,
      assignedLabs: true,
      custodian: true,
    },
  });

  return resulted;
};

export const deleteLab = async ({ labId }: { labId: number }) => {
  await prisma.assignedLab.deleteMany({
    where: {
      labId: labId,
    },
  });
  await prisma.items.deleteMany({
    where: {
      labId: labId,
    },
  });
  const deletedLab = await prisma.lab.delete({
    where: {
      labId: labId,
    },
  });
  revalidatePath("admin/laboratory");
  return deletedLab;
};

export const updateCustodianName = async ({
  labId,
  custodianName,
}: {
  labId: number;
  custodianName: string;
}) => {
  const updatedCustodian = prisma.lab.update({
    where: {
      labId: labId,
    },
    data: {
      custodianName: custodianName,
    },
  });
  revalidatePath("/admin/laboratory");
  return updatedCustodian;
};

export async function updateUserRole(userId: string, selectedRole: string) {
  try {
    const updatedUser = await prisma.user.update({
      where: { email: userId }, // ya id use karo agar email unique nahi hai
      data: { role: selectedRole as Role },
    });

    return updatedUser;
  } catch (error) {
    console.error("Error updating user role:", error);
    return null;
  }
}

export async function getCurrentCustodian(userId: string) {
  try {
    // Clerk se current user id nikal lo

    if (!userId) return null;

    // DB me user nikal lo with relations
    const custodian = await prisma.user.findUnique({
      where: { email: (userId) }, // agar clerk ka userId string hai toh mapping chahiye
      include: {
        department: true,
        labs: {
          select:{
            department:true,
            labId:true,
            labName:true,
            assignedLabs:true
          }
        }
      },
    });

    return custodian;
  } catch (error) {
    console.error("Error fetching custodian:", error);
    return null;
  }
}

export const getDepartment = async ()=>{
  return await prisma.department.findMany({
    select:{
      department_Name:true,
      departmentId:true,
      labs:true
    }
  })
}
