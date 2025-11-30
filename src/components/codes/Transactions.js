import styles from '../styles/Transactions.module.scss'
import Transaction from './Transaction'
import { useNavigate } from 'react-router-dom';

const Transactions = ({ transactions, accounts }) => {
    const navigate = useNavigate();
    function home() {
        navigate('/');
    }
    const sortedTransactions = [...transactions].sort((a, b) => new Date(b.date) - new Date(a.date));
    return (
        <div className={styles.transactionsBox}>
            <div className={styles.transactions}>
                {sortedTransactions.map((t) => (<Transaction key={t.id} transaction={t} accounts={accounts} />))}
                <div className='buttonContainer'>
                    <button className="backBtn button" onClick={(e) => { e.preventDefault(); home() }}>Back</button>
                </div>
            </div>
        </div>
    )
}

export default Transactions