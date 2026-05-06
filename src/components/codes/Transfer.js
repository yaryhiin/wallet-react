import { useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { limitToDecimals, getFormattedLocalDateTime, fetchRate } from '../../utils';
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
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [date, setDate] = useState(formattedDate);
  const [isFlipped, setIsFlipped] = useState(false);

  const [errors, setErrors] = useState({});

  const fromAccount = accounts.find((a) => String(a.id) === String(from))
  const toAccount = accounts.find((a) => String(a.id) === String(to))
  const [fromCurrency, setFromCurrency] = useState(fromAccount ? fromAccount.currency : null);
  const [toCurrency, setToCurrency] = useState(toAccount ? toAccount.currency : null);

  useEffect(() => {
    if (accounts !== []) return;

    setFrom(accounts[0].id);
    setTo(accounts[1].id);
  }, [accounts]);

  useEffect(() => {
    async function loadRate() {
      if (!fromCurrency || !toCurrency) return;

      const fetchedRate = await fetchRate(fromCurrency, toCurrency);

      if (fetchedRate !== null) {
        setExchangeRate(limitToDecimals(fetchedRate, 4));
      }
    }

    loadRate();
  }, [fromCurrency, toCurrency]);

  useEffect(() => {
    const fromAcc = accounts.find((account) => account.id === from);
    const toAcc = accounts.find((account) => account.id === to);
    setFromCurrency(fromAcc ? fromAcc.currency : null);
    setToCurrency(toAcc ? toAcc.currency : null);
  }, [from, to, accounts]);

  if (!accounts) {
    return <p>Loading transfer...</p>;
  }

  function handleSwapCurrencies() {
    const oldFrom = fromCurrency;
    const oldTo = toCurrency;

    setFromCurrency(oldTo);
    setToCurrency(oldFrom);
    console.log(oldFrom, oldTo);
    console.log(fromCurrency, toCurrency);
  }

  const onSubmit = async (e) => {
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

    await transfer(from, to, amount, date, limitToDecimals(adjustedExchangeRate, 4))

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
    <div className={styles.formContainer}>
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
            onChange={(e) => setAmount(limitToDecimals(e.target.value, 2) || 0)}
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
          <div className={styles.fieldRow}>
            1 {fromCurrency} =
            <input
              className={cn(styles.input, errors.exchangeRate && styles.error)}
              value={exchangeRate ?? ""}
              placeholder="Enter exchange rate"
              type="number"
              step="0.0001"
              required
              onChange={(e) => setExchangeRate(limitToDecimals(e.target.value, 4) || 0)}
            /> {toCurrency}
            <button
              className={cn(styles.convertBtn, "button")}
              onClick={() => { setIsFlipped(prev => !prev); handleSwapCurrencies(); }}
            >
              🔄
            </button>
          </ div>
        </div>

        <div className={cn(styles.inputContainer, styles.fullWidth)}>
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