import { z } from "zod";
export const accountSchema = z.object({
  name: z.string().min(1, "Name is required"),
  type: z.enum(["CURRENT","SAVINGS", "CREDIT", "LOAN"]),
  balance: z.string().min(1, "Balance is required").regex(/^\d+(\.\d{1,2})?$/, "Balance must be a valid number with up to two decimal places"),
  isDefault : z.boolean().default(false),
});