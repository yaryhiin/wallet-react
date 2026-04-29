import styles from '../styles/Transactions.module.scss'
import Transaction from './Transaction'
import ViewAllTransactions from './ViewAllTransactions'

const RecentTransactions = ({ transactions, accounts }) => {
  const sortedTransactions = [...transactions].sort((a, b) => new Date(b.date) - new Date(a.date));
  return (
    <div className={styles.transactionsBox}>
      <h1 className='title'>Recent Transactions</h1>
      {transactions.length === 0 && (
        <div className={styles.noTransactionsContainer}>
          <h3 className={styles.header}>No transactions yet.</h3>
          <p className={styles.text}>Your recent activity will appear here.</p>
        </div>
      )}
      {sortedTransactions.slice(0, 3).map(t => (<Transaction key={t.id} transaction={t} accounts={accounts} />))}
      {transactions.length > 3 && <ViewAllTransactions />}
    </div>
  )
}

export default RecentTransactions