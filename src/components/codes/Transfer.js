import { useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { limitToTwoDecimals, getFormattedLocalDateTime } from '../../utils';
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
  const [to, setTo] = useState(accounts[0].id);
  const [date, setDate] = useState(formattedDate);

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

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

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
      <div className="inputBox">
        <div className="inputContainer">
          <p className="inputText">Amount</p>
          <input
            className={cn("input", errors.amount ? "error" : "")}
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
          <select className={cn("input", errors.from ? "error" : "")} value={from} required onChange={(e) => setFrom(e.target.value)}>
            {accounts.map((account) => (
              <option key={account.id} value={account.id}>{account.name}</option>
            ))}
          </select>
        </div>
        <div className="inputContainer">
          <p className="inputText">To</p>
          <select className={cn("input", errors.to ? "error" : "")} value={to} required onChange={(e) => setTo(e.target.value)}>
            {accounts.map((account) => (
              <option key={account.id} value={account.id}>{account.name}</option>
            ))}
          </select>
        </div>
        <div className="inputContainer">
          <p className="inputText">Exchange Rate</p>
          1 {fromAccount.currency} = <input
            className={cn("input", errors.exchangeRate ? "error" : "")}
            value={exchangeRate === 0 ? '' : exchangeRate}
            placeholder="Enter exchange rate"
            type="number"
            step="0.01"
            required
            onChange={(e) => setExchangeRate(limitToTwoDecimals(e.target.value) || 0)}
          /> {toAccount.currency}
        </div>
        <div className="inputContainer">
          <p className="inputText">Date</p>
          <input
            type="datetime-local"
            className={cn("input", errors.date ? "error" : "")}
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