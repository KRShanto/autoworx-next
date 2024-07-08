import React from 'react'
import AttendanceTable from './AttendanceTable'
import PerformanceTable from './PerformanceTable'

export default function AttendancePerformance() {
  return (
    <div className="flex  justify-between mt-10 gap-2">
      <AttendanceTable />
      <PerformanceTable />
    </div>
  )
}
