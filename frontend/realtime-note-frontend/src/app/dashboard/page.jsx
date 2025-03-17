import Dashboard from '@/components/Dashboard'
import PrivateRoute from '@/components/PrivateRoute'
import React from 'react'

const page = () => {
  return (
   <>
   <PrivateRoute>
    <Dashboard/>
   </PrivateRoute>
   </>
  )
}

export default page