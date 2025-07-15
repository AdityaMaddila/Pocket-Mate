"use server";

import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

// Helper to convert Prisma Decimal to number
const serializeAmount = (obj) => ({
  ...obj,
  amount: obj.amount.toNumber(),
});

/**
 * Create a transaction and update account balance.
 */
export async function createTransaction(data) {
  try {
    const { userId } = await auth();
    if (!userId) throw new Error("User not authenticated");

    const user = await db.user.findUnique({
      where: { clerkUserId: userId },
    });
    if (!user) throw new Error("User not found");

    const account = await db.account.findUnique({
      where: {
        id: data.accountId,
        userId: user.id,
      },
    });
    if (!account) throw new Error("Account not found");

    const balanceChange = data.type === "EXPENSE" ? -data.amount : data.amount;
    const newBalance = account.balance.toNumber() + balanceChange;

    const transaction = await db.$transaction(async (tx) => {
      const newTransaction = await tx.transaction.create({
        data: {
          type: data.type,
          amount: data.amount,
          date: new Date(data.date),
          description: data.description || "",
          category: data.category,
          accountId: account.id,
          userId: user.id,
          isRecurring: data.isRecurring || false,
          recurringInterval: data.recurringInterval || null,
          nextRecurringDate:
            data.isRecurring && data.recurringInterval
              ? calculateNextRecurringDate(data.recurringInterval, data.date)
              : null,
          status: data.status || "PENDING", // Optional if in schema
        },
      });

      await tx.account.update({
        where: { id: account.id },
        data: { balance: newBalance },
      });

      return newTransaction;
    });

    // Refresh relevant pages
    revalidatePath("/dashboard");
    revalidatePath(`/account/${transaction.accountId}`);

    return { success: true, data: serializeAmount(transaction) };
  } catch (error) {
    throw new Error(`Transaction creation failed: ${error.message}`);
  }
}


function calculateNextRecurringDate(interval, date) {
    const nextDate = new Date(date);
    switch(interval) {
        case 'DAILY':
            nextDate.setDate(nextDate.getDate() + 1);
            break;
        case 'WEEKLY':
            nextDate.setDate(nextDate.getDate() + 7);
            break;
        case 'MONTHLY':
            nextDate.setMonth(nextDate.getMonth() + 1);
            break;
        case 'YEARLY':
            nextDate.setFullYear(nextDate.getFullYear() + 1);
            break;
        default:
            throw new Error("Invalid interval");
    }
    return nextDate;
}   
export async function getTransaction(id) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const user = await db.user.findUnique({
    where: { clerkUserId: userId },
  });

  if (!user) throw new Error("User not found");

  const transaction = await db.transaction.findUnique({
    where: {
      id,
      userId: user.id,
    },
  });

  if (!transaction) throw new Error("Transaction not found");

  return serializeAmount(transaction);
}