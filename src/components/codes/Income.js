import { useNavigate } from 'react-router-dom'
import { useState } from 'react'
import styles from '../styles/Income.module.css'

const Income = ({ income, accounts }) => {

  const navigate = useNavigate();
  function home() {
    navigate('/');
  }

  const today = new Date();
  const formattedDate = today.toISOString().split('T')[0];

  const [amount, setAmount] = useState(0);
  const [category, setCategory] = useState("Salary");
  const [method, setMethod] = useState(accounts[0].id);
  const [date, setDate] = useState(formattedDate);

  const onSubmit = (e) => {
    e.preventDefault();

    const accountWithMethod = accounts.find((account) => account.id === method);
    let currency = accountWithMethod.currency
    let type = 'income'
    income({ category, amount, currency, type, method, date }, accountWithMethod)

    setAmount(0);
    setCategory('');
    setMethod(0);
    setDate('');

    home();
  }

  const onBack = (e) => {
    e.preventDefault();

    setAmount(0);
    setCategory('');
    setMethod(0);
    setDate('');

    home();
  }

  return (
    <>
      <div className={styles.incomeBox}>
        <div className={styles.incomeContainer}>
          <p className={styles.incomeText}>Amount</p>
          <input className={`${styles.income} ${styles.incomeAmount}`} value={amount} type="number" required onChange={(e) => setAmount(parseInt(e.target.value) || 0)} />
        </div>
        <div className={styles.incomeContainer}>
          <p className={styles.incomeText}>Category</p>
          <select className={styles.incomeCategory} value={category} required onChange={(e) => setCategory(e.target.value)} >
            <option value="Salary">Salary</option>
            <option value="Crypto">Crypto</option>
            <option value="Interests">Interests</option>
            <option value="Business">Business</option>
            <option value="Gifts">Gifts</option>
            <option value="Rewards">Rewards</option>
            <option value="Side Hustle">Side Hustle</option>
          </select>
        </div>
        <div className={styles.incomeContainer}>
          <p className={styles.incomeText}>Method</p>
          <select className={styles.incomeMethod} value={method} required onChange={(e) => setMethod(parseInt(e.target.value))}>
            {accounts.map((account) => <option key={account.id} value={account.id}>{account.name}</option>)}
          </select>
        </div>
        <div className={styles.incomeContainer}>
          <p className={styles.incomeText}>Date</p>
          <input type="date" className={styles.incomeDate} value={date} required onChange={(e) => setDate(e.target.value)} />
        </div>
      </div>
      <div className={styles.buttonContainer}>
        <button className={styles.backBtn} onClick={onBack}>Back</button>
        <button className={styles.saveIncomeBtn} onClick={onSubmit}>Save</button>
      </div>
    </>
  )
}

export default Income