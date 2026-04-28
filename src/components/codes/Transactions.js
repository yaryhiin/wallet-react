import styles from '../styles/Transactions.module.scss'
import { useNavigate } from 'react-router-dom';
import { formatDate } from '../../utils';

const Transactions = ({ transactions, accounts }) => {
    const navigate = useNavigate();
    function home() {
        navigate('/');
    }
    const sortedTransactions = [...transactions].sort((a, b) => new Date(b.date) - new Date(a.date));
    return (
        <div className={styles.allTransactionsBox}>
            <h1 className="title">All Transactions</h1>
            <table>
                <thead>
                    <tr>
                        <th>Category</th>
                        <th>Amount</th>
                        <th>Currency</th>
                        <th>Account</th>
                        <th>Date</th>
                    </tr>
                </thead>

                <tbody>

                    {sortedTransactions.map((transaction) => (

                        <tr key={transaction.id} className={styles.transactionRow} onClick={() => navigate(`/changeTransaction/${transaction.id}`)}>
                            <td className={styles.transCategory}>{transaction.category}</td>
                            {transaction.type === 'income' ?
                                <td className={styles.transAmountIncome}>{transaction.amount}</td>
                                :
                                <td className={styles.transAmountExpense}>{transaction.amount}</td>
                            }
                            <td className={styles.transCurrency}>{transaction.currency}</td>
                            <td>{accounts.find(account => account.id === transaction.method).name || 'Unknown Account'}</td>
                            <td>{formatDate(transaction.date)}</td>
                        </tr>
                    ))}

                </tbody>
            </table>
            <div className='buttonContainer'>
                <button className="backBtn button" onClick={(e) => { e.preventDefault(); home() }}>Back</button>
            </div>
        </div >
    )
}

export default Transactions