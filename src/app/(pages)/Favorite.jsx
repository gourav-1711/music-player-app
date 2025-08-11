import ExpandableCardDemo from '@/components/expandable-card-demo-standard'
import React from 'react'

export default function Favorite() {
  return (
    <div className='max-w-6xl mx-auto p-6 w-[calc(100%-1rem)]'>
      <h1 className='text-2xl font-bold'>Your Favorite Songs</h1>
      <div>
        <ExpandableCardDemo/>
      </div>
    </div>
  )
}
