import { useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { limitToTwoDecimals } from '../../utils';

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
      <div className="inputBox">
        <div className="inputContainer">
          <p className="inputText">Amount</p>
          <input
            className="input"
            value={amount}
            type="number"
            step="0.01"
            required
            onChange={(e) => setAmount(limitToTwoDecimals(e.target.value) || 0)}
          />
        </div>
        <div className="inputContainer">
          <p className="inputText">From</p>
          <select className="input" value={from} required onChange={(e) => setFrom(e.target.value)}>
            {accounts.map((account) => (
              <option key={account.id} value={account.id}>{account.name}</option>
            ))}
          </select>
        </div>
        <div className="inputContainer">
          <p className="inputText">To</p>
          <select className="input" value={to} required onChange={(e) => setTo(e.target.value)}>
            {accounts.map((account) => (
              <option key={account.id} value={account.id}>{account.name}</option>
            ))}
          </select>
        </div>
        <div className="inputContainer">
          <p className="inputText">Exchange Rate</p>
          1 {fromAccount.currency} = <input
            className="input"
            value={exchangeRate}
            type="number"
            step="0.01"
            required
            onChange={(e) => setExchangeRate(limitToTwoDecimals(e.target.value) || 0)}
          /> {toAccount.currency}
        </div>
        <div className="inputContainer">
          <p className="inputText">Date</p>
          <input
            type="date"
            className="input"
            value={date}
            required
            onChange={(e) => setDate(e.target.value)}
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