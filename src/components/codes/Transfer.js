import { useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { limitToTwoDecimals, getFormattedLocalDateTime, getInputClass } from '../../utils';
import styles from '../styles/Transfer.module.scss'

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
    <>
      <div className="inputBox">
        <div className="inputContainer">
          <p className="inputText">Amount</p>
          <input
            className={getInputClass('amount', errors)}
            value={amount === 0 ? '' : amount}
            placeholder="Enter amount"
            type="number"
            step="0.01"
            required
            onChange={(e) => setAmount(limitToTwoDecimals(e.target.value) || 0)}
          />
        </div>
        <div className="inputContainer">
          <p className="inputText">From</p>
          <select className={getInputClass('from', errors)} value={from} required onChange={(e) => setFrom(e.target.value)}>
            {accounts.map((account) => (
              <option key={account.id} value={account.id}>{account.name}</option>
            ))}
          </select>
        </div>
        <div className="inputContainer">
          <p className="inputText">To</p>
          <select className={getInputClass('to', errors)} value={to} required onChange={(e) => setTo(e.target.value)}>
            {accounts.map((account) => (
              <option key={account.id} value={account.id}>{account.name}</option>
            ))}
          </select>
        </div>
        <div className="inputContainer">
          <p className="inputText">Exchange Rate</p>
          1 {!isFlipped ? fromAccount.currency : toAccount.currency} = <input
            className={getInputClass('exchangeRate', errors)}
            value={exchangeRate === 0 ? '' : exchangeRate}
            placeholder="Enter exchange rate"
            type="number"
            step="0.01"
            required
            onChange={(e) => setExchangeRate(limitToTwoDecimals(e.target.value) || 0)}
          /> {!isFlipped ? toAccount.currency : fromAccount.currency}
          <button className={`${styles.convertBtn} button`} onClick={() => { setIsFlipped(prev => !prev); }}>🔄</button>
        </div>
        <div className="inputContainer">
          <p className="inputText">Date</p>
          <input
            type="datetime-local"
            className={getInputClass('date', errors)}
            value={date}
            required
            onChange={(e) => setDate(getFormattedLocalDateTime(e.target.value))}
          />
        </div>
      </div>
      <div className="buttonContainer">
        <button className="backBtn button" onClick={onBack}>Back</button>
        <button className="saveBtn button" onClick={onSubmit}>Save</button>
      </div>

    </>
  )
}

export default Transfer