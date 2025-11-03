"use server";
import { PrismaClient, Role } from "@prisma/client";
import bcrypt from "bcryptjs";
import { writeLog } from "@/lib/logger";
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
    writeLog(`FAILED USER CREATION: Missing fields for email=${email || "N/A"}`);
    throw new Error("All fields are required");
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        employeeId,
        departmentId,
        password: hashedPassword,
        role,
        action: "PENDING",
      },
    });

    writeLog(`USER CREATED: ${email} (role=${role})`);
    return user;
  } catch (err: any) {
    writeLog(`ERROR IN USER CREATION: ${email} | ${err.message}`);
    throw err;
  }
}

export async function login(data: UserResponse) {
  const { email, password } = data;

  if (!email || !password) {
    writeLog(`FAILED LOGIN: Missing email or password`);
    return { success: false, message: "Email and password are required" };
  }

  const user = await prisma.user.findUnique({
    where: { email },
    include: { department: true },
  });

  if (!user) {
    writeLog(`FAILED LOGIN: User not found - ${email}`);
    return { success: false, message: "User not found" };
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    writeLog(`FAILED LOGIN: Invalid password - ${email}`);
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
    writeLog(`UNAUTHORIZED ACCESS: ${signedUser.email} attempted login`);
    return { success: false, message: "You are not authorised." };
  }
  console.log(`[${new Date().toISOString()}] SUCCESSFUL LOGIN: ${signedUser.email} (${signedUser.role})`);


  await createSession(signedUser);
  writeLog(`SUCCESSFUL LOGIN: ${signedUser.email} (${signedUser.role})`);

  return { success: true, user: signedUser };
}

export async function getUsers() {
  try {
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

    const formattedUsers = users.map((user) => ({
      id: user.id,
      name: user.name,
      email: user.email,
      employeeId: user.employeeId,
      department: user.department,
      departmentName: user.department?.department_Name,
      role: user.role,
      action: user.action,
    }));

    // Logging like login function
    console.log(
      `[${new Date().toISOString()}] FETCHED USERS: ${formattedUsers.length} users`
    );
    writeLog(
      `FETCHED USERS: ${formattedUsers.length} users`
    );

    return formattedUsers;
  } catch (error: any) {
    console.error(
      `[${new Date().toISOString()}] ERROR FETCHING USERS: ${error.message}`
    );
    writeLog(`ERROR FETCHING USERS: ${error.message}`);
    return [];
  }
}

export const getCurrentUser = async () => {
  try {
    writeLog("FETCH USER: Verifying session...");

    const user = await verifySession();

    if (!user) {
      writeLog("FETCH USER FAILED: No active session found");
      return null;
    }

    writeLog(`FETCH USER: Session verified for ${user.email}`);

    const dbUser = await prisma.user.findFirst({
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

    if (!dbUser) {
      writeLog(`FETCH USER FAILED: No record found in DB for ${user.email}`);
      return null;
    }

    writeLog(`FETCH USER SUCCESS: ${dbUser.email} (role=${dbUser.role})`);
    return dbUser;
  } catch (err: any) {
    writeLog(`ERROR FETCHING USER: ${err.message}`);
    return null;
  }
};

export async function userLogout() {
  try {
    writeLog("LOGOUT: Verifying active session...");

    const user = await verifySession();

    if (!user) {
      writeLog("LOGOUT FAILED: No active session found");
      return null;
    }

    const cookieStore = await cookies();
    cookieStore.delete("session");

    writeLog(`LOGOUT SUCCESS: ${user.email} logged out successfully`);
    return { message: "Logged out successfully" };
  } catch (err: any) {
    writeLog(`LOGOUT ERROR: ${err.message}`);
    return { message: "Logout failed due to server error" };
  }
}

export const approveUser = async ({ email }: { email: string }) => {
  try {
    writeLog(`APPROVAL STARTED: Attempting to approve user with email: ${email}`);

    const user = await prisma.user.update({
      where: { email },
      data: { action: "APPROVED" },
    });

    writeLog(`APPROVAL SUCCESS: User ${email} approved successfully`);
    return user;
  } catch (err: any) {
    writeLog(`APPROVAL ERROR: Failed to approve ${email} - ${err.message}`);
    throw new Error("Failed to approve user");
  }
};

export const rejectUser = async ({ email }: { email: string }) => {
  try {
    writeLog(`REJECTION STARTED: Attempting to reject user with email: ${email}`);

    const user = await prisma.user.update({
      where: { email },
      data: { action: "REJECTED" },
    });

    writeLog(`REJECTION SUCCESS: User ${email} rejected successfully`);
    return user;
  } catch (err: any) {
    writeLog(`REJECTION ERROR: Failed to reject ${email} - ${err.message}`);
    throw new Error("Failed to reject user");
  }
};

export const createLab = async (data: lab) => {
  const { labNumber, labName, departmentId, custodianId } = data;

  try {
    writeLog(`CREATE LAB STARTED: Attempting to create lab "${labName}" (Dept: ${departmentId}, Custodian: ${custodianId})`);

    if (!labName || !custodianId) {
      writeLog(`CREATE LAB ERROR: Missing required fields for lab creation`);
      throw new Error("These fields are required: labName, custodianId");
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

    writeLog(`CREATE LAB SUCCESS: Lab "${labName}" created successfully (ID: ${resultedLab.labId})`);
    return resultedLab;

  } catch (err: any) {
    writeLog(`CREATE LAB FAILURE: Error creating lab "${labName}" - ${err.message}`);
    throw new Error("Failed to create lab");
  }
};

export const getLabsDetail = async () => {
  try {
    writeLog(`FETCH LABS STARTED: Fetching all lab details with departments, custodians, and assignments`);

    const resulted = await prisma.lab.findMany({
      include: {
        department: true,
        assignedLabs: true,
        custodian: true,
      },
    });

    writeLog(`FETCH LABS SUCCESS: Retrieved ${resulted.length} labs from database`);
    return resulted;

  } catch (err: any) {
    writeLog(`FETCH LABS ERROR: Failed to retrieve labs - ${err.message}`);
    throw new Error("Failed to fetch lab details");
  }
};

export const deleteLab = async ({ labId }: { labId: number }) => {
  try {
    writeLog(`DELETE LAB STARTED: Attempting to delete lab with ID: ${labId}`);

    // Step 1: Delete related assigned labs
    const deletedAssignments = await prisma.assignedLab.deleteMany({
      where: { labId },
    });
    writeLog(`DELETE LAB STEP: Deleted ${deletedAssignments.count} assigned labs for LabID: ${labId}`);

    // Step 2: Delete related items
    const deletedItems = await prisma.items.deleteMany({
      where: { labId },
    });
    writeLog(`DELETE LAB STEP: Deleted ${deletedItems.count} items for LabID: ${labId}`);

    // Step 3: Delete the lab itself
    const deletedLab = await prisma.lab.delete({
      where: { labId },
    });
    writeLog(`DELETE LAB SUCCESS: Lab deleted successfully (LabID: ${labId}, LabName: ${deletedLab.labName})`);

    // Step 4: Revalidate page cache
    revalidatePath("admin/laboratory");

    return deletedLab;
  } catch (err: any) {
    writeLog(`DELETE LAB ERROR: Failed to delete lab with ID ${labId} - ${err.message}`);
    throw new Error("Failed to delete lab");
  }
};

export const updateCustodianName = async ({
  labId,
  custodianName,
}: {
  labId: number;
  custodianName: string;
}) => {
  try {
    writeLog(`UPDATE CUSTODIAN STARTED: LabID ${labId}, New Custodian: ${custodianName}`);

    if (!labId || !custodianName) {
      writeLog(`UPDATE CUSTODIAN ERROR: Missing required fields (LabID or CustodianName)`);
      throw new Error("Lab ID and custodian name are required");
    }

    const updatedCustodian = await prisma.lab.update({
      where: { labId },
      data: { custodianName },
    });

    writeLog(
      `UPDATE CUSTODIAN SUCCESS: LabID ${labId} updated with new custodian "${updatedCustodian.custodianName}"`
    );

    revalidatePath("/admin/laboratory");

    return updatedCustodian;
  } catch (err: any) {
    writeLog(`UPDATE CUSTODIAN ERROR: Failed to update LabID ${labId} - ${err.message}`);
    throw new Error("Failed to update custodian name");
  }
};

export async function updateUserRole(userId: string, selectedRole: string) {
  try {
    writeLog(`UPDATE ROLE STARTED: Updating role for user ${userId} to ${selectedRole}`);

    if (!userId || !selectedRole) {
      writeLog(`UPDATE ROLE ERROR: Missing required parameters (userId or selectedRole)`);
      throw new Error("User ID and role are required");
    }

    const updatedUser = await prisma.user.update({
      where: { email: userId }, // or { id: userId } if you're using ID instead
      data: { role: selectedRole as Role },
    });

    writeLog(`UPDATE ROLE SUCCESS: ${userId} role changed to ${selectedRole}`);
    return updatedUser;

  } catch (error: any) {
    writeLog(`UPDATE ROLE FAILURE: Failed to update role for ${userId} - ${error.message}`);
    return null;
  }
}

export async function getCurrentCustodian(userId: string) {
  try {
    writeLog(`FETCH CUSTODIAN STARTED: Attempting to fetch custodian with userId/email: ${userId}`);

    if (!userId) {
      writeLog(`FETCH CUSTODIAN ERROR: Missing userId parameter`);
      return null;
    }

    const custodian = await prisma.user.findUnique({
      where: { email: userId }, // adjust to { id: userId } if needed
      include: {
        department: true,
        labs: {
          select: {
            department: true,
            labId: true,
            labName: true,
            assignedLabs: true,
          },
        },
      },
    });

    if (!custodian) {
      writeLog(`FETCH CUSTODIAN WARNING: No custodian found for userId/email: ${userId}`);
      return null;
    }

    writeLog(
      `FETCH CUSTODIAN SUCCESS: Custodian "${custodian.name}" fetched successfully with ${custodian.labs?.length || 0} labs`
    );

    return custodian;

  } catch (error: any) {
    writeLog(`FETCH CUSTODIAN ERROR: Failed to fetch custodian ${userId} - ${error.message}`);
    return null;
  }
}

export const getDepartment = async () => {
  try {
    writeLog(`FETCH DEPARTMENT STARTED: Fetching all departments with labs and custodians`);

    const departments = await prisma.department.findMany({
      select: {
        department_Name: true,
        departmentId: true,
        labs: {
          select: {
            labName: true,
            labNumber: true,
            labId: true,
            custodian: {
              select: {
                email: true,
                name: true,
                id: true,
              },
            },
          },
        },
      },
    });

    writeLog(`FETCH DEPARTMENT SUCCESS: Retrieved ${departments.length} departments`);
    return departments;

  } catch (err: any) {
    writeLog(`FETCH DEPARTMENT ERROR: Failed to retrieve departments - ${err.message}`);
    throw new Error("Failed to fetch departments");
  }
};
  