import styles from '../styles/Header.module.scss'
import cn from 'classnames'

const ImportData = ({ importData }) => {
    return (
        <div>
            <button className={cn("button", styles.importData)} onClick={importData}>Import</button>
        </div>
    )
}

export default ImportData