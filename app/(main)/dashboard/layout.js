import React from 'react'
import DashboardPage from './page';
import { ClockLoader } from 'react-spinners';
import { Suspense } from 'react';
const DashboardLayout = () => {
  return (
    <div className='text-white px-5'>
      <Suspense fallback={<ClockLoader className='mt-4' width={"100%"} color='bg-gradient-to-r from-pink-500 to-purple-600'/>}>

        <DashboardPage/>
      </Suspense>
    </div>
  );
};

export default DashboardLayout;