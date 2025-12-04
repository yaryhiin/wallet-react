import React from 'react'

const ExportData = (exportData) => {
  return (
    <div>
        <button className="button exportData" onClick={exportData.exportData}>Export Data</button>
    </div>
  )
}

export default ExportData