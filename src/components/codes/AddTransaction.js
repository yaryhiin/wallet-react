import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import styles from '../styles/AddTransaction.module.css';
import cn from 'classnames';

const AddTransaction = ({ addTransaction, type, accounts }) => {

  const incomeMethod = ["Salary", "Crypto", "Interests", "Business", "Gifts", "Rewards", "Side Hustle"];
  const expenseMethod = ["Food", "Rent", "Utilities", "Entertainment", "Transportation", "Healthcare", "Shopping", "Subscriptions", "Education", "Travel"];

  const options = type === "expense" ? expenseMethod : incomeMethod

  const [errors, setErrors] = useState({});

  const navigate = useNavigate();
  function home() {
    navigate('/');
  }

  const today = new Date();
  const formattedDate = today.toISOString().split('T')[0];

  const [amount, setAmount] = useState(0);
  const [category, setCategory] = useState('');
  const [method, setMethod] = useState('');
  const [date, setDate] = useState(formattedDate);

  const onSubmit = (e) => {
    e.preventDefault();

    const newErrors = {};
    if (!amount || amount <= 0) newErrors.amount = true;
    if (!category) newErrors.category = true;
    if (!method) newErrors.method = true;

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const accountWithMethod = accounts.find((account) => account.id === method);
    const changedAmount = type === 'expense' ? -amount : amount
    addTransaction({ category, amount: changedAmount, currency: accountWithMethod.currency, type, method, date }, accountWithMethod)

    setAmount(0);
    setCategory('');
    setMethod(0);
    setDate(formattedDate);

    home();
  }

  const onBack = (e) => {
    e.preventDefault();

    setAmount(0);
    setCategory('');
    setMethod(0);
    setDate(formattedDate);

    home();
  }

  return (
    <>
      <div className={styles.addTransactionBox}>
        <div className={styles.addTransactionContainer}>
          <p className={styles.addTransactionText}>Amount</p>
          <input min="1" className={cn(styles.addTransaction, styles.addTransactionAmount, errors.amount ? styles.error : '')} value={amount === 0 ? '' : amount} placeholder='Enter amount' type="number" required onChange={(e) => setAmount(parseInt(e.target.value) || 0)} />
        </div>
        <div className={styles.addTransactionContainer}>
          <p className={styles.addTransactionText}>Category</p>
          <select className={cn(styles.addTransactionCategory, errors.category ? styles.error : '')} value={category} required onChange={(e) => setCategory(e.target.value)} >
            <option value="" disabled>Select Category</option>
            {options.map((method, index) => <option key={index} value={method}>{method}</option>)}
          </select>
        </div>
        <div className={styles.addTransactionContainer}>
          <p className={styles.addTransactionText}>Method</p>
          <select className={cn(styles.addTransactionMethod, errors.method ? styles.error : '')} value={method} required onChange={(e) => setMethod(parseInt(e.target.value))}>
            <option value="" disabled>Select Method</option>
            {accounts.map((account) => <option key={account.id} value={account.id}>{account.name}</option>)}
          </select>
        </div>
        <div className={styles.addTransactionContainer}>
          <p className={styles.addTransactionText}>Date</p>
          <input type="date" className={styles.addTransactionDate} value={date} required onChange={(e) => setDate(e.target.value)} />
        </div>
      </div >
      <div className={styles.buttonContainer}>
        <button className={styles.backBtn} onClick={onBack}>Back</button>
        <button className={styles.saveAddTransactionBtn} onClick={onSubmit}>Save</button>
      </div>
    </>
  )
}

export default AddTransaction
