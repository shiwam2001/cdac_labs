'use server'
import { Activety, PrismaClient } from "@prisma/client";
import { revalidatePath } from "next/cache";

const prisma = new PrismaClient();

export async function createTransferRequest({
  itemId,
  fromLabId,
  toLabId,
  fromDeptId,
  toDeptId,
  quantity,
  requestedBy,
}: {
  itemId: number;
  fromLabId: number;
  toLabId: number;
  fromDeptId: number;
  toDeptId: number;
  quantity: number;
  requestedBy?: string;
}) {
  try {
   const item = await prisma.items.findUnique({
  where: { id: itemId },
});

if (!item) {
  throw new Error("Item not found");
}

// Update item status when transfer request is sent
 await prisma.items.update({
  where: { id: itemId },
  data: {
    status: "TRANSFER_REQUESTS",
  },
});

    if (!item || quantity < quantity) {
      return { success: false, message: "Insufficient quantity" };
    }
    const transfer = await prisma.transferRequest.create({
      data: {
        itemId,
        fromLabId,
        toLabId,
        fromDeptId,
        toDeptId,
        quantity,
        requestedBy,
        
      },
    });
    revalidatePath("/user/inventory");
    revalidatePath("/custodian/item_Request");
    return { success: true, transfer };
  } catch (err) {
    console.error(err);
    return { success: false, message: "Error creating transfer request" };
  }
}

export const getTransferRequests = async () => {
  const transferRequests = await prisma.transferRequest.findMany({
    include: {
      item: {
        include: {
          assignedBy: true,
        },
      },
      fromLab: {
        include: {
          custodian: true,
        },
      },
      toLab:{
        include: {
          custodian: true,
        },
      },
      fromDepartment: true,
      toDepartment: true,
    },
  });
  return transferRequests  
};

export async function approveTransfer(transferId: number) {
  try {
    const transfer = await prisma.transferRequest.findUnique({
      where: { id: transferId },
      include: { item: true },
    });

    if (!transfer) {
      throw new Error("Transfer request not found");
    }

       const [updatedItem, updatedTransfer] = await prisma.$transaction([
      // 1️⃣ Update item lab and department
      prisma.items.update({
        where: { id: transfer.itemId },
        data: {
          labId: transfer.toLabId,
          departmentId: transfer.toDeptId,
          transferedUserId:transfer.item.assignedUserId,
          activety: Activety.TRANSFER,
          assignedUserId:null,
          updatedAt: new Date(),
        },
      }),

      // 2️⃣ Update transfer request status
      prisma.transferRequest.update({
        where: { id: transferId },
        data: {
          status: "APPROVED",
          updatedAt: new Date(),
        },
        include: {
          item: true,
          fromLab: true,
          toLab: true,
          fromDepartment: true,
          toDepartment: true,
        },
      }),
    ]);

revalidatePath("/custodian/item_Request")
    return {
      success: true,
      message: "Transfer approved successfully.",
      updatedItem,
      updatedTransfer,
    };
  } catch (error: any) {
    console.error("Error approving transfer:", error);
    return { success: false, message: error.message };
  }
}

export async function rejectTransfer(id: number) {
  try {
    const existingTransfer = await prisma.transferRequest.findUnique({
      where: { id },
    });

    if (!existingTransfer) {
      return { success: false, message: "Transfer request not found." };
    }

    // Agar already approved/rejected hai toh dobara reject na ho
    if (existingTransfer.status !== "PENDING") {
      return { success: false, message: "This transfer is already processed." };
    }

    // Transfer ko reject mark karo
    await prisma.transferRequest.update({
      where: { id },
      data: {
        status: "REJECTED",
        updatedAt: new Date(),
      },
    });

    await prisma.items.update({
      where: { id: existingTransfer.itemId },
      data: {
        status: "APPROVED", // Ya jo bhi previous status tha wo set karo
      },
    });
    revalidatePath("/user/inventory");
    revalidatePath("/custodian/item_Request");

    return { success: true, message: "Transfer request rejected successfully." };
  } catch (error) {
    console.error("Reject transfer error:", error);
    return { success: false, message: "Failed to reject transfer." };
  }
}

export const getMyTransferRequests = async ( UserId:number) => {
  const transferRequests = await prisma.transferRequest.findMany({
    where:{
       OR: [
      { item: { assignedUserId: UserId } },
      { item: { transferedUserId: UserId } },
    ]
    },
    include: {
      item: {
        include: {
          assignedBy: true,
        },
      },
      fromLab: {
        include: {
          custodian: true,
        },
      },
      toLab:{
        include: {
          custodian: true,
        },
      },
      fromDepartment: true,
      toDepartment: true,
    },
  });
  return transferRequests  
};
