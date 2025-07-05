"use client";
import React, { useState} from "react";
import { useForm } from "react-hook-form";
import { Input } from "./ui/input"; 
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "./ui/select"; // Adjust the import path as necessary
import { zodResolver } from "@hookform/resolvers/zod";
import { accountSchema } from "@/app/lib/schema"; // Adjust the import path as necessary
import { Switch } from "./ui/switch"; // Adjust the import path as necessary

import {
  Drawer,
  DrawerTrigger,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
  DrawerFooter,
  DrawerClose,
} from "./ui/drawer";
import { Button } from "./ui/button"; // Don't forget this if Button is custom

const CreateAccountDrawer = ({ children }) => {
  const [open, setOpen] = useState(false);
  const {register,handleSubmit,formState:{errors},setValue,watch,reset}=useForm({
    resolver: zodResolver(accountSchema),
    defaultValues: {
      name: "",
      type: "CURRENT",
      balance: "",
      isDefault: false,
    },
  })
  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger>{children}</DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Are you absolutely sure?</DrawerTitle>
          <DrawerDescription>This action cannot be undone.</DrawerDescription>
        </DrawerHeader>
        <div className="px-4 pb-4">
          <form className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="name">Account Name</label>
              <Input id="name" placeholder="Enter account name" {...register("name")} />
              {errors.name && <p className="text-red-500">{errors.name.message}</p>}
            </div>
            <div className="space-y-2">
              <label htmlFor="type" className="text-sm font-medium">Account Type</label>
              <Select onValueChange={(value) => setValue("type", value)}
                defaultValue={watch("type")}>
                <SelectTrigger id="type">
                  <SelectValue placeholder="Select account type" />
                </SelectTrigger>
                <SelectContent className="w-max" >
                  <SelectItem value="CURRENT">Current</SelectItem>
                  <SelectItem value="SAVINGS">Savings</SelectItem>
                  <SelectItem value="CREDIT">Credit</SelectItem>
                </SelectContent>
              </Select>
              {errors.type && <p className="text-red-500">{errors.type.message}</p>}
            </div>
            <div className="space-y-2">
              <label htmlFor="balance">Initial Balance</label>
              <Input id="balance" type="number" step="0.01" placeholder="0.00" {...register("blance")} />
              {errors.name && <p className="text-red-500">{errors.balance.message}</p>}
            </div>
            <div className="flex items-center justify-between rounded-lg border p-3 bg-gray-50">
              <div >
                <label htmlFor="balance"  className="text-sm font-medium cursor-pointer">Set as Default</label>
                <p className="text-sm text-muted-foreground">This will be your default account for transactions</p>
                <Switch id="isDefault" onCheckedChange={(checked) => setValue("isDefault", checked)}
                  checked={watch("isDefault")}/>
              </div>
            </div>

        <DrawerFooter>
          <DrawerClose asChild>
            <Button type="button" variant="outline" className="flex-1 ">Cancel</Button>
          </DrawerClose>
          <Button type="submit" className="flex-1" onClick={handleSubmit((data) => {
            console.log(data);
            reset();
            setOpen(false);
          })}>
            Create Account
          </Button>
          
        </DrawerFooter>
          </form>
        </div>
      </DrawerContent>
    </Drawer>
  );
};

export default CreateAccountDrawer;
