import { seedTransactions } from "@/actions/seeder";

export async function GET(){
    const result=await seedTransactions();
    return Response.json(result);
}