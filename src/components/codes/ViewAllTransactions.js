import { Link } from 'react-router-dom'
import styles from '../styles/ViewAllTransactions.module.css'

const ViewAllTransactions = () => {
  return (
    <Link to='transactions'>
      <div className={styles.viewBox}>
        <div className={styles.viewAll}>
          <p>View all transactions</p>
        </div>
      </div>
    </Link>
  )
}

export default ViewAllTransactions