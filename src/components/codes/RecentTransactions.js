import styles from '../styles/Transactions.module.scss'
import Transaction from './Transaction'
import ViewAllTransactions from './ViewAllTransactions'

const RecentTransactions = ({ transactions, accounts }) => {
  const sortedTransactions = [...transactions].sort((a, b) => new Date(b.date) - new Date(a.date));
  return (
    <div className={styles.transactionsBox}>
      <div className={styles.transactions}>
        {sortedTransactions.slice(0, 3).map(t => (<Transaction key={t.id} transaction={t} accounts={accounts} />))}
      </div>
      {transactions.length > 3 && <ViewAllTransactions />}
    </div>
  )
}

export default RecentTransactions