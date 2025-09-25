"use server";
import { Action, Activety, PrismaClient } from "@prisma/client";
import { revalidatePath } from "next/cache";

const prisma = new PrismaClient();

type FormData = {
  deviceNumber: string;
  deviceType: string;
};
export const addItems = async (data: {
  departmentId: number;
  labId: number;
  assignedUserId: number;
  custodianName: string;
  deviceNumber: string;
  deviceName: string;
  deviceQuantity:number;
  dateTill?: Date | null;
}) => {
  revalidatePath("user/inventory");
  return await prisma.items.create({
    data: {
      departmentId: data.departmentId,
      labId: data.labId,
      assignedUserId: data.assignedUserId,
      custodianName: data.custodianName,
      deviceNumber: data.deviceNumber,
      quantity:data.deviceQuantity,
      deviceType: data.deviceName,
      dateTill: data.dateTill || null,
    },
  });
};

export const getAddedItems = async (userId: number) => {
  return await prisma.items.findMany({
    where: {
      assignedUserId: userId,
    },
    include: {
      department: true,
      lab: {
        select: {
          labId: true,
          labName: true,
          labNumber: true,
          custodian: true,
          custodianId: true,
          department: true,
        },
      },
      assignedBy: true,
    },
    orderBy: {
      id: "desc",
    },
  });
};

export async function getItemsDetails() {
  return await prisma.items.findMany({
    // where:{
    //   labId:
    // },
    include: {
      department: {
        select: {
          department_Name: true,
          labs: true,
          departmentId: true,
        },
      },
      lab: true,
      assignedBy: true,
    },
  });
}

export async function getCustodianItems(userId: string) {
  try {
    const items = await prisma.items.findMany({
      where: {
        lab: {
          custodianId: userId, // 👈 filter labs by custodianId = current user
        },
      },
      include: {
        lab: true,
        assignedBy: true,
      },
    });
    return items;
  } catch (error) {
    console.error("Error fetching custodian items:", error);
    throw new Error("Failed to fetch custodian items");
  }
}

export async function getItemsApproved(itemId: number, activety: string) {
  if (activety === "DELETE") {
      const items = await prisma.items.delete({
        where:{
          id:itemId
        }
      })
      return {items,status:"success"}
  } else {
    const items = await prisma.items.update({
      where: {
        id: itemId,
      },
      data: {
        status: "APPROVED",
      },
    });
    revalidatePath("custodian/notification");
    return items;
  }
}

export async function getItemLogs() {
  return await prisma.items.findMany({
    include: {
      assignedBy: true,
      department: true,
      lab: {
        select: {
          custodian: true,
          labId: true,
          labNumber: true,
          labName: true,
          createdAt: true,
          custodianId: true,
        },
      },
    },
  });
}

export async function updateItem(selectedItemId: number, formData: FormData) {
  if (!selectedItemId || !formData) {
    return console.error("Data not come here");
  }
  const result = await prisma.items.updateMany({
    where: {
      id: selectedItemId,
    },
    data: {
      deviceNumber: formData.deviceNumber,
      deviceType: formData.deviceType,
      status: "PENDING",
      activety: "UPDATE",
    },
  });
  revalidatePath("user/inventory");
  return result;
}

export const transferItem = async (
  Id: number,
  selectedDepartmentId: number,
  selectedLabId: number
) => {
  revalidatePath("user/inventory");
  return await prisma.items.update({
    where: {
      id: Id,
    },
    data: {
      department: {
        connect: { departmentId: selectedDepartmentId },
      },
      lab: {
        connect: { labId: selectedLabId },
      },
      status: "PENDING",
      activety: "TRANSFER",
    },
  });
};

export const handleItemRejection = async (id: number) => {
  
  await prisma.items.update({
    where: {
      id: id,
    },
    data: {
      status: "REJECTED",
    },
  });
};

export const handleItemDeletion = async (id: number) => {
  revalidatePath("user/inventory")
  await prisma.items.update({
    where: {
      id: id,
    },
    data: {
      activety: "DELETE",
      status: "PENDING",
    },
  });
};
