import { z } from "zod";
export const accountSchema = z.object({
  name: z.string().min(1, "Name is required"),
  type: z.enum(["CURRENT","SAVINGS", "CREDIT", "LOAN"]),
  balance: z.string().min(1, "Balance is required").regex(/^\d+(\.\d{1,2})?$/, "Balance must be a valid number with up to two decimal places"),
  isDefault : z.boolean().default(false),
});
export const transactionSchema = z.object({
  type: z.enum(["EXPENSE", "INCOME"]),
  amount: z.string().min(1, "Amount is required"),
  date: z.date({ required_error:"Date is required"}),
  description: z.string().optional(),
  category: z.string().min(1,"Category is needed"),
  accountId: z.string().min(1, "Account is required"),
  isRecurring: z.boolean().default(false),
  recurringInterval: z.enum(["DAILY", "WEEKLY", "MONTHLY"]).optional(),
}).superRefine((data,ctx) => {
  if(data.isRecurring && !data.recurringInterval) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Recurring interval is required for recurring transactions", 
      path: ["recurringInterval"],
    });
  }
})