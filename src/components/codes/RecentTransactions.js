import styles from '../styles/Transactions.module.css'
import Transaction from './Transaction'
import AllTransactions from './AllTransactions'

const RecentTransactions = ({ transactions, accounts, openTransaction }) => {
  return (
    <div className={styles.transactionsBox}>
      <div className={styles.transactions}>
        {transactions.slice(-3).reverse().map((transaction) => (<Transaction key={transaction.id} transaction={transaction} accounts={accounts} openTransaction={openTransaction} />))}
      </div>
      {transactions.length > 3 && <AllTransactions />}
    </div>
  )
}

export default RecentTransactions