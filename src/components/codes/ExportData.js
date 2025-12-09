import styles from '../styles/Header.module.scss'
import cn from 'classnames'

const ExportData = ({ exportData }) => {
  return (
    <div>
      <button className={cn("button", styles.exportData)} onClick={exportData}>Export</button>
    </div>
  )
}

export default ExportData