"use server";
import { PrismaClient } from "@prisma/client";
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
  deviceQuantity: number;
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
      quantity: data.deviceQuantity,
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
      transferedBy: true,
    },
    orderBy: {
      id: "desc",
    },
  });
};
export async function getItemsDetails() {
  return await prisma.items.findMany({
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
      transferedBy: true,
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
        lab: {
          include: {
            custodian: true,
          },
        },
        assignedBy: true,
        transferedBy: true,
        department: true,
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
    await prisma.transferRequest.deleteMany({
      where: { itemId: itemId },
    });

    const items = await prisma.items.delete({
      where: { id: itemId },
    });
    revalidatePath("custodian/notification");
    return { items, status: "success" };
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
      transferedBy: true,
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
  try {
    if (!selectedItemId) {
      console.error("❌ No item ID provided");
      return null;
    }

    const { deviceNumber, deviceType } = formData;
    if (!deviceNumber || !deviceType) {
      console.error("❌ Missing required fields in formData");
      return null;
    }

    // update item
    const result = await prisma.items.update({
      where: { id: selectedItemId },
      data: {
        deviceNumber,
        deviceType,
        status: "PENDING",
        activety: "UPDATE",
      },
    });

    // revalidate route cache
    revalidatePath("/user/inventory");

    console.log("✅ Item updated successfully!");
    return result;
  } catch (error) {
    console.error("⚠️ Error updating item:", error);
    throw error;
  }
}
export const transferItem = async (
  Id: number,
  selectedDepartmentId: number,
  selectedLabId: number,
  transferQuantity: number
) => {
  const item = await prisma.items.findUnique({ where: { id: Id } });
  if (!item) return { data: "Item not founded" };

  revalidatePath("user/inventory");

  if ((item.quantity ?? 0) > transferQuantity) {
    await prisma.items.update({
      where: {
        id: Id,
      },
      data: {
        quantity: (item.quantity ?? 0) - transferQuantity,
      },
    });

    return await prisma.items.create({
      data: {
        deviceNumber: item.deviceNumber,
        deviceType: item.deviceType,
        quantity: transferQuantity,
        departmentId: selectedDepartmentId,
        labId: selectedLabId,
        assignedUserId: item.assignedUserId,
        custodianName: item.custodianName,
        status: "PENDING",
        activety: "TRANSFER",
      },
    });
  } else {
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
  }
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
  revalidatePath("user/inventory");
  await prisma.items.update({
    where: {
      id: id,
    },
    data: {
      activety: "DELETE",
      status: "DELETE_REQUESTS",
    },
  });
};
export const dataDetails = async (labId: number) => {
  const result = await prisma.items.findMany({
    where: { labId },
    include: {
      assignedBy: true,
      transferedBy: true,
    },
  });
  revalidatePath("admin/inventory");
  return result;
};
