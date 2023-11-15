import { useNavigate } from 'react-router-dom'
import { useState } from 'react'
import styles from '../styles/ChangeTransaction.module.css'

const ChangeTransaction = ({ accounts, transaction, changeTransaction, deleteTransaction }) => {
    const navigate = useNavigate();
    function home() {
        navigate('/');
    }

    const [type, setType] = useState(transaction.type);
    const [amount, setAmount] = useState(transaction.amount);
    const [category, setCategory] = useState(transaction.category);
    const [method, setMethod] = useState(transaction.method);
    const [date, setDate] = useState(transaction.date);

    let id = transaction.id
    let currency = transaction.currency;

    const onSubmit = (e) => {
        e.preventDefault();

        changeTransaction({ id, category, amount, currency, type, method, date })

        setType('');
        setAmount(0);
        setCategory('');
        setMethod(0);
        setDate('');

        home();
    }

    const onBack = (e) => {
        e.preventDefault();

        setType('');
        setAmount(0);
        setCategory('');
        setMethod(0);
        setDate('');

        home();
    }

    const onDelete = (e) => {
        e.preventDefault();

        setType('');
        setAmount(0);
        setCategory('');
        setMethod(0);
        setDate('')

        deleteTransaction(id);

        home();
    }

    return (
        <>
            <div className={styles.incomeBox}>
                <div className={styles.transChangeContainer}>
                    <p className={styles.transChangeText}>Type</p>
                    <select className={styles.transChangeType} value={type} required onChange={(e) => setType(e.target.value)}>
                        <option value="income">Income</option>
                        <option value="expense">Expense</option>
                    </select>
                </div>
                <div className={styles.transChangeContainer}>
                    <p className={styles.transChangeText}>Amount</p>
                    <input className={`${styles.transChange} ${styles.transChangeAmount}`} value={amount} type="number" required onChange={(e) => setAmount(parseInt(e.target.value) || 0)} />
                </div>
                <div className={styles.transChangeContainer}>
                    <p className={styles.transChangeText}>Category</p>
                    <select className={styles.transChangeCategory} value={category} required onChange={(e) => setCategory(e.target.value)} >
                        <option value="Salary">Salary</option>
                        <option value="Crypto">Crypto</option>
                        <option value="Interests">Interests</option>
                        <option value="Business">Business</option>
                        <option value="Gifts">Gifts</option>
                        <option value="Rewards">Rewards</option>
                        <option value="Side Hustle">Side Hustle</option>
                        <option value="Groceries">Groceries</option>
                        <option value="Cafe">Cafe</option>
                        <option value="Credit">Credit</option>
                        <option value="Transporting">Transporting</option>
                        <option value="Entertainment">Entertainment</option>
                        <option value="Sport">Sport</option>
                        <option value="Health">Health</option>
                        <option value="Education">Education</option>
                        <option value="Gifts">Gifts</option>
                        <option value="Charity">Charity</option>
                    </select>
                </div>
                <div className={styles.transChangeContainer}>
                    <p className={styles.transChangeText}>Method</p>
                    <select className={styles.transChangeMethod} value={method} required onChange={(e) => setMethod(parseInt(e.target.value))}>
                        {accounts.map((account) => <option key={account.id} value={account.id}>{account.name}</option>)}
                    </select>
                </div>
                <div className={styles.transChangeContainer}>
                    <p className={styles.transChangeText}>Date</p>
                    <input type="date" className={styles.transChangeDate} value={date} required onChange={(e) => setDate(e.target.value)} />
                </div>
            </div>
            <div className={styles.buttonContainer}>
                <button className={styles.backBtn} onClick={onBack}>Back</button>
                <button className={styles.transChangeBtn} onClick={onSubmit}>Save</button>
                <button className={styles.deleteTransBtn} onClick={onDelete}>Delete</button>
            </div>
        </>
    )
}

export default ChangeTransaction