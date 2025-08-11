import ExpandableCardDemo from '@/components/expandable-card-demo-grid'
import React from 'react'

export default function History() {
  return (
    <div className="max-w-6xl mx-auto">
      <h1 className='text-2xl font-bold text-white italic '>Recently Played Songs</h1>
      <div>
          <ExpandableCardDemo />
      </div>
    </div>
  )
}
