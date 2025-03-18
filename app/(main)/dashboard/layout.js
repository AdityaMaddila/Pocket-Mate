import React from 'react'
import DashboardPage from './page';
import { BarLoader } from 'react-spinners';
import { Suspense } from 'react';
const DashboardLayout = () => {
  return (
    <div className='text-white px-5'>
      <h1 className='text-6xl font-bold gradient-title mb-5'>Dashboard</h1>
      <Suspense fallback={<BarLoader className='mt-4' width={"100%"} color='bg-gradient-to-r from-pink-500 to-purple-600'/>}>
        <DashboardPage/>
      </Suspense>
    </div>
  );
};

export default DashboardLayout;