import React from 'react'

const ImportData = ({ importData }) => {
    return (
        <div>
            <button className="button importData" onClick={importData}>Import</button>
        </div>
    )
}

export default ImportData