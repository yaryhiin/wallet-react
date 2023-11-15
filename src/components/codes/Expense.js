import { useNavigate } from 'react-router-dom'
import { useState } from 'react'
import styles from '../styles/Expense.module.css'

const Expense = ({ expense, accounts }) => {

  const navigate = useNavigate();
  function home() {
    navigate('/');
  }

  const today = new Date();
  const formattedDate = today.toISOString().split('T')[0];

  const [amount, setAmount] = useState(0);
  const [category, setCategory] = useState("Groceries");
  const [method, setMethod] = useState(accounts[0].id);
  const [date, setDate] = useState(formattedDate);

  const onSubmit = (e) => {
    e.preventDefault();

    const accountWithMethod = accounts.find((account) => account.id === method);
    let currency = accountWithMethod.currency
    let type = 'expense'
    expense({ category, amount, currency, type, method, date }, accountWithMethod)

    setAmount(0);
    setCategory();
    setMethod('');
    setDate('');

    home();
  }

  const onBack = (e) => {
    e.preventDefault();

    setAmount(0);
    setCategory();
    setMethod('');
    setDate('');

    home();
  }

  return (
    <>
      <div className={styles.expenseBox}>
        <div className={styles.expenseContainer}>
          <p className={styles.expenseText}>Amount</p>
          <input className={`${styles.expense} ${styles.expenseAmount}`} value={amount} type="number" required onChange={(e) => setAmount(parseInt(e.target.value) || 0)} />
        </div>
        <div className={styles.expenseContainer}>
          <p className={styles.expenseText}>Category</p>
          <select className={styles.expenseCategory} value={category} required onChange={(e) => setCategory(e.target.value)} >
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
        <div className={styles.expenseContainer}>
          <p className={styles.expenseText}>Method</p>
          <select className={styles.expenseMethod} value={method} required onChange={(e) => setMethod(parseInt(e.target.value))}>
            {accounts.map((account) => <option key={account.id} value={account.id}>{account.name}</option>)}
          </select>
        </div>
        <div className={styles.expenseContainer}>
          <p className={styles.expenseText}>Date</p>
          <input type="date" className={styles.expenseDate} value={date} required onChange={(e) => setDate(e.target.value)} />
        </div>
      </div>
      <div className={styles.buttonContainer}>
        <button className={styles.backBtn} onClick={onBack}>Back</button>
        <button className={styles.saveIncomeBtn} onClick={onSubmit}>Save</button>
      </div>
    </>
  )
}

export default Expense