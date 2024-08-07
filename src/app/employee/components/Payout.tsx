import React from 'react'
import PayoutCard from './PayoutCard'

export default function Payout() {
  return (
    <div className='flex space-x-6 '>
      <PayoutCard
        title="Previous Month Payout"
        amount="$3464"
        percentage="100%"
      />
      <PayoutCard
        title="Current Month Payout"
        amount="$2780"
        percentage="90%"

      />
      <PayoutCard
        title="YTD Payout"
        amount="$4000"
        percentage="85%"
      />
    </div>
  )
}
