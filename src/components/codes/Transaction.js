import { Link } from 'react-router-dom'
import styles from '../styles/Transactions.module.scss'
import cn from 'classnames';

const Transaction = ({ transaction, accounts, openTransaction }) => {
    return (
        <Link to='../changeTransaction'>
            <div className={cn("button", styles.transactionStyle)} onClick={() => openTransaction(transaction)}>
                <div className={styles.transactionDetails}>
                    <div className={styles.leftDetails}>
                        <p className={styles.transName}>{transaction.category}</p>
                        <p className={styles.transMethod}>{accounts.map((account) => account.id === transaction.method && account.name)}</p>
                    </div>
                    <div className={styles.rightDetails}>
                        {transaction.type === 'income' ?
                            <>
                                <p className={styles.transAmountIncome}>{transaction.amount}</p>
                                <p className={styles.transCurrencyIncome}>{transaction.currency}</p>
                            </>
                            :
                            <>
                                <p className={styles.transAmountExpense}>{transaction.amount}</p>
                                <p className={styles.transCurrencyExpense}>{transaction.currency}</p>
                            </>}
                        <p className={styles.transDate}>{transaction.date}</p>
                    </div>
                </div>
            </div>
        </Link>
    )
}

export default Transaction