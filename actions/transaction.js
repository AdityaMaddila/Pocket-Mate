"use server";

import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { revalidatePath } from "next/cache";

// Helper to convert Prisma Decimal to number
const serializeAmount = (obj) => ({
  ...obj,
  amount: obj.amount.toNumber(),
});
//Gemini INtegration
const genAi= new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

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

// Updated scanReceipt function in your server actions file
export async function scanReceipt(file) {
  try {
    // Server-side validation as backup
    if (file.size > 1024 * 1024) { // 1MB limit
      throw new Error("Image file is too large. Please compress the image and try again.");
    }

    if (!file.type.startsWith('image/')) {
      throw new Error("Please upload a valid image file.");
    }

    console.log('Processing file:', {
      name: file.name,
      size: `${(file.size / 1024).toFixed(2)} KB`,
      type: file.type
    });

    const model = genAi.getGenerativeModel({ model: "gemini-1.5-flash" });
    const arrayBuffer = await file.arrayBuffer();

    const prompt = `Analyze this receipt image and extract the following information in JSON format:
      - Total amount (just the number)
      - Date (in ISO format)
      - Description or items purchased (brief summary)
      - Merchant/store name
      - Suggested category (one of: housing,transportation,groceries,utilities,entertainment,food,shopping,healthcare,education,personal,travel,insurance,gifts,bills,other-expense)
      
      Only respond with valid JSON in this exact format:
      {
        "amount": number,
        "date": "ISO date string",
        "description": "string",
        "merchantName": "string",
        "category": "string"
      }

      If it's not a receipt, return an empty object`;

    const base64String = Buffer.from(arrayBuffer).toString("base64");
    const result = await model.generateContent([
      {
        inlineData: {
          data: base64String,
          mimeType: file.type,
        },
      },
      prompt,
    ]);

    const response = await result.response;
    const text = response.text();
    const cleanedText = text.replace(/```(?:json)?\n?/g, "").trim();

    try {
      const data = JSON.parse(cleanedText);
      
      // Validate the parsed data
      if (!data.amount && !data.date) {
        throw new Error("No receipt data found in the image");
      }

      return {
        amount: parseFloat(data.amount) || 0,
        date: new Date(data.date),
        description: data.description || "Receipt scan",
        category: data.category || "other-expense",
        merchantName: data.merchantName || "Unknown",
      };
    } catch (parseError) {
      console.error("Error parsing JSON response:", parseError);
      console.error("Raw response:", text);
      throw new Error("Could not extract receipt data. Please ensure the image is clear and contains a receipt.");
    }

  } catch (error) {
    console.error("Error scanning receipt:", error.message);
    throw new Error(`Receipt scanning failed: ${error.message}`);
  }
}

// Add this function to your existing transaction server action file

export async function updateTransaction(id, data) {
  try {
    const { userId } = await auth();
    if (!userId) throw new Error("User not authenticated");

    const user = await db.user.findUnique({
      where: { clerkUserId: userId },
    });
    if (!user) throw new Error("User not found");

    // Get the existing transaction
    const existingTransaction = await db.transaction.findUnique({
      where: {
        id,
        userId: user.id,
      },
      include: {
        account: true,
      },
    });

    if (!existingTransaction) throw new Error("Transaction not found");

    // Check if the account is being changed
    const newAccount = await db.account.findUnique({
      where: {
        id: data.accountId,
        userId: user.id,
      },
    });
    if (!newAccount) throw new Error("Account not found");

    const updatedTransaction = await db.$transaction(async (tx) => {
      // Reverse the old transaction from the old account
      const oldBalanceChange = existingTransaction.type === "EXPENSE" 
        ? existingTransaction.amount.toNumber() 
        : -existingTransaction.amount.toNumber();
      
      await tx.account.update({
        where: { id: existingTransaction.accountId },
        data: { 
          balance: existingTransaction.account.balance.toNumber() + oldBalanceChange 
        },
      });

      // Apply the new transaction to the new account
      const newBalanceChange = data.type === "EXPENSE" ? -data.amount : data.amount;
      const newAccountBalance = newAccount.balance.toNumber() + newBalanceChange;

      await tx.account.update({
        where: { id: newAccount.id },
        data: { balance: newAccountBalance },
      });

      // Update the transaction
      const updated = await tx.transaction.update({
        where: { id },
        data: {
          type: data.type,
          amount: data.amount,
          date: new Date(data.date),
          description: data.description || "",
          category: data.category,
          accountId: newAccount.id,
          isRecurring: data.isRecurring || false,
          recurringInterval: data.recurringInterval || null,
          nextRecurringDate:
            data.isRecurring && data.recurringInterval
              ? calculateNextRecurringDate(data.recurringInterval, data.date)
              : null,
        },
      });

      return updated;
    });

    // Refresh relevant pages
    revalidatePath("/dashboard");
    revalidatePath(`/account/${existingTransaction.accountId}`);
    revalidatePath(`/account/${updatedTransaction.accountId}`);

    return { success: true, data: serializeAmount(updatedTransaction) };
  } catch (error) {
    throw new Error(`Transaction update failed: ${error.message}`);
  }
}