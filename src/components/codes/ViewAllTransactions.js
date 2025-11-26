import { Link } from 'react-router-dom'
import styles from '../styles/ViewAllTransactions.module.scss'
import cn from 'classnames';

const ViewAllTransactions = () => {
  return (
    <Link to='transactions'>
      <div className={styles.viewBox}>
        <div className={cn(styles.viewAll, "button")}>
          <p>View all transactions</p>
        </div>
      </div>
    </Link>
  )
}

export default ViewAllTransactions