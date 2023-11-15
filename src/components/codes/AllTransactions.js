import { Link } from 'react-router-dom'
import styles from '../styles/AllTransactions.module.css'

const AllTransactions = () => {
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

export default AllTransactions