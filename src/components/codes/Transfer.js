import { useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { limitToTwoDecimals, getFormattedLocalDateTime } from '../../utils';
import styles from '../styles/FormLayout.module.scss'
import cn from 'classnames';

const Transfer = ({ transfer, accounts }) => {

  const navigate = useNavigate();
  function home() {
    navigate('/');
  }

  const formattedDate = getFormattedLocalDateTime(new Date());

  const [exchangeRate, setExchangeRate] = useState(0);
  const [amount, setAmount] = useState(0);
  const [from, setFrom] = useState(accounts[0].id);
  const [to, setTo] = useState(accounts[1].id);
  const [date, setDate] = useState(formattedDate);
  const [isFlipped, setIsFlipped] = useState(false);

  const [errors, setErrors] = useState({});

  const fromAccount = accounts.find((account) => account.id === from)
  const toAccount = accounts.find((account) => account.id === to)

  const onSubmit = (e) => {
    e.preventDefault();

    const newErrors = {};
    if (!amount || amount <= 0) newErrors.amount = true;
    if (!exchangeRate) newErrors.exchangeRate = true;
    if (!from) newErrors.from = true;
    if (!to) newErrors.to = true;
    if (!date) newErrors.date = true;
    if (from === to) { newErrors.to = true; newErrors.from = true; }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const adjustedExchangeRate = isFlipped
      ? 1 / exchangeRate
      : exchangeRate;

    transfer(from, to, amount, date, adjustedExchangeRate)

    setAmount(0);
    setFrom(accounts[0].id);
    setTo(accounts[1].id);
    setDate('');

    home();
  }

  const onBack = (e) => {
    e.preventDefault();

    setAmount(0);
    setFrom(accounts[0].id);
    setTo(accounts[1].id);
    setDate('');

    home();
  }

  return (
    <div>
      <div className={styles.inputBox}>
        <div className={styles.inputContainer}>
          <p className={styles.inputText}>Amount</p>
          <input
            className={cn(styles.input, errors.amount && styles.error)}
            value={amount === 0 ? '' : amount}
            placeholder="Enter amount"
            type="number"
            step="0.01"
            required
            onChange={(e) => setAmount(limitToTwoDecimals(e.target.value) || 0)}
          />
        </div>

        <div className={styles.inputContainer}>
          <p className={styles.inputText}>From</p>
          <select
            className={cn(styles.input, errors.from && styles.error)}
            value={from}
            required
            onChange={(e) => setFrom(e.target.value)}
          >
            {accounts.map((account) => (
              <option key={account.id} value={account.id}>{account.name}</option>
            ))}
          </select>
        </div>

        <div className={styles.inputContainer}>
          <p className={styles.inputText}>To</p>
          <select
            className={cn(styles.input, errors.to && styles.error)}
            value={to}
            required
            onChange={(e) => setTo(e.target.value)}
          >
            {accounts.map((account) => (
              <option key={account.id} value={account.id}>{account.name}</option>
            ))}
          </select>
        </div>

        <div className={styles.inputContainer}>
          <p className={styles.inputText}>Exchange Rate</p>
          1 {!isFlipped ? fromAccount.currency : toAccount.currency} =
          <input
            className={cn(styles.input, errors.exchangeRate && styles.error)}
            value={exchangeRate === 0 ? '' : exchangeRate}
            placeholder="Enter exchange rate"
            type="number"
            step="0.01"
            required
            onChange={(e) => setExchangeRate(limitToTwoDecimals(e.target.value) || 0)}
          /> {!isFlipped ? toAccount.currency : fromAccount.currency}
          <button
            className={cn(styles.convertBtn, "button")}
            onClick={() => setIsFlipped(prev => !prev)}
          >
            🔄
          </button>
        </div>

        <div className={styles.inputContainer}>
          <p className={styles.inputText}>Date</p>
          <input
            type="datetime-local"
            className={cn(styles.input, errors.date && styles.error)}
            value={date}
            required
            onChange={(e) => setDate(getFormattedLocalDateTime(e.target.value))}
          />
        </div>
      </div>

      <div className={styles.buttonContainer}>
        <button className="backBtn button" onClick={onBack}>Back</button>
        <button className={cn(styles.saveBtn, "button")} onClick={onSubmit}>Save</button>
      </div>
    </div>
  )
}

export default Transfer