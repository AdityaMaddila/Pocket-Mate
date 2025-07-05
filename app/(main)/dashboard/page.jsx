import React from 'react'
import CreateAccountDrawer from '@/components/createAccountDrawer';
import { Card,CardContent } from '@/components/ui/card';
import { Plus } from 'lucide-react';
const DashboardPage = () => {
  return (
    <div className='px-5'>
      <div className='grid gap-4 md:grid-cols-2 lg"grid-cols-3'>
        <CreateAccountDrawer>
          <Card className='gradient'>
            <CardContent className='flex flex-col items-center justify-center h-full'>
              <Plus className='w-8 h-8'/>
              <h2 className='text-lg font-semibold pt-5'>Create New Account</h2>
            </CardContent>
          </Card>
        </CreateAccountDrawer>
      </div>
    </div>
  );
};

export default DashboardPage;