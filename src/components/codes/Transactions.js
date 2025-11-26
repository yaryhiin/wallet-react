import styles from '../styles/Transactions.module.scss'
import Transaction from './Transaction'

const Transactions = ({ transactions, accounts }) => {
    return (
        <div className={styles.transactionsBox}>
            <div className={styles.transactions}>
                {transactions.reverse().map((transaction) => (<Transaction key={transaction.id} transaction={transaction} accounts={accounts} />))}
            </div>
        </div>
    )
}

export default Transactions