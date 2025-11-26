import styles from '../styles/Transactions.module.scss'
import Transaction from './Transaction'
import ViewAllTransactions from './ViewAllTransactions'

const RecentTransactions = ({ transactions, accounts, openTransaction }) => {
  return (
    <div className={styles.transactionsBox}>
      <div className={styles.transactions}>
        {transactions.slice(-3).reverse().map((transaction) => (<Transaction key={transaction.id} transaction={transaction} accounts={accounts} openTransaction={openTransaction} />))}
      </div>
      {transactions.length > 3 && <ViewAllTransactions />}
    </div>
  )
}

export default RecentTransactions