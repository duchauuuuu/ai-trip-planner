import { PricingTable } from '@clerk/nextjs'
import { Luggage } from 'lucide-react'
import { div } from 'motion/react-client'
import React from 'react'

const Pricing = () => {
  return (
    <div className='mt-20'>
        <h2 className='font-bold text-3xl my-5 flex items-center justify-center'><Luggage className='mr-2'/> AI-Powered Trip Planning | Pick Your Plan</h2>
     <div style={{ maxWidth: '400px', margin: '0 auto', padding: '0 1rem' }}>
      <PricingTable />
    </div>
    </div>
  )
}

export default Pricing