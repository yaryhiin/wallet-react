import { useNavigate } from 'react-router-dom'
import { useState } from 'react'
import styles from '../styles/Transfer.module.css'

const Transfer = ({ transfer, accounts }) => {

  const navigate = useNavigate();
  function home() {
    navigate('/');
  }

  const today = new Date();
  const formattedDate = today.toISOString().split('T')[0];

  const [exchangeRate, setExchangeRate] = useState(1);
  const [amount, setAmount] = useState(0);
  const [from, setFrom] = useState(accounts[0].id);
  const [to, setTo] = useState(accounts[0].id);
  const [date, setDate] = useState(formattedDate);

  const fromAccount = accounts.find((account) => account.id === from)
  const toAccount = accounts.find((account) => account.id === to)

  const onSubmit = (e) => {
    e.preventDefault();
    transfer(from, to, amount, date, exchangeRate)

    setAmount(0);
    setFrom(0);
    setTo(0);
    setDate('');

    home();
  }

  const onBack = (e) => {
    e.preventDefault();

    setAmount(0);
    setFrom(0);
    setTo(0);
    setDate('');

    home();
  }

  return (
    <>
      <div className={styles.transferBox}>
        <div className={styles.transferContainer}>
          <p className={styles.transferText}>Amount</p>
          <input className={`${styles.transfer} ${styles.transferAmount}`} value={amount} type="number" required onChange={(e) => setAmount(parseInt(e.target.value) || 0)} />
        </div>
        <div className={styles.transferContainer}>
          <p className={styles.transferText}>Method</p>
          <select className={styles.transferMethod} value={from} required onChange={(e) => setFrom(parseInt(e.target.value))}>
            {accounts.map((account) => <option key={account.id} value={account.id}>{account.name}</option>)}
          </select>
        </div>
        <div className={styles.transferContainer}>
          <p className={styles.transferText}>Method</p>
          <select className={styles.transferMethod} value={to} required onChange={(e) => setTo(parseInt(e.target.value))}>
            {accounts.map((account) => <option key={account.id} value={account.id}>{account.name}</option>)}
          </select>
        </div>
        <div className={styles.transferContainer}>
          <p className={`${styles.transferText} ${styles.exchangeRate}`}>Exchange Rate</p>
          1 {fromAccount.currency} = <input className={`${styles.transfer} ${styles.transferExchangeRate}`} value={exchangeRate} type="number" required onChange={(e) => setExchangeRate(parseInt(e.target.value) || 0)} /> {toAccount.currency}
        </div>
        <div className={styles.transferContainer}>
          <p className={styles.transferText}>Date</p>
          <input type="date" className={styles.transferDate} value={date} required onChange={(e) => setDate(e.target.value)} />
        </div>
      </div>
      <div className={styles.buttonContainer}>
        <button className={styles.backBtn} onClick={onBack}>Back</button>
        <button className={styles.saveTransferBtn} onClick={onSubmit}>Save</button>
      </div>
    </>
  )
}

export default Transfer