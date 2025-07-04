import React from 'react'
import CreateAccountDrawer from '@/components/createAccountDrawer';
function DashboardPage  () {
  return (
    <div className='text-white px-5'>
      {/* accounts */}
      <div>
        <CreateAccountDrawer>

        </CreateAccountDrawer>
      </div>
    </div>
  )
}

export default DashboardPage;