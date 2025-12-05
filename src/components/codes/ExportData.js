import React from 'react'

const ExportData = ({ exportData }) => {
  return (
    <div>
      <button className="button exportData" onClick={exportData}>Export</button>
    </div>
  )
}

export default ExportData