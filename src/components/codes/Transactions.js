import styles from '../styles/Transactions.module.scss'
import Transaction from './Transaction'

const Transactions = ({ transactions, accounts, openTransaction }) => {
    return (
        <div className={styles.transactionsBox}>
            <div className={styles.transactions}>
                {transactions.reverse().map((transaction) => (<Transaction key={transaction.id} transaction={transaction} accounts={accounts} openTransaction={openTransaction} />))}
            </div>
        </div>
    )
}

export default Transactions