import { useNavigate } from 'react-router-dom'
import { useState } from 'react'
import cn from 'classnames'
import { limitToTwoDecimals } from '../../utils'

const AddAccount = ({ addAccount }) => {

  const accountCurrency = ["UAH", "PLN", "USD", "CAD"];
  const accountIcon = ["card_blue", "card_pink", "cash", "crypto", "bank", "euro", "usd"];

  const [errors, setErrors] = useState({});

  const navigate = useNavigate();
  function home() {
    navigate('/');
  }
  const [name, setName] = useState('');
  const [balance, setBalance] = useState(0);
  const [currency, setCurrency] = useState('');
  const [icon, setIcon] = useState('');

  const onSubmit = (e) => {
    e.preventDefault();

    const newErrors = {};
    if (!name) newErrors.name = true;
    if (!balance || balance < 0) newErrors.balance = true;
    if (!currency) newErrors.currency = true;
    if (!icon) newErrors.icon = true;

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    addAccount({ name, balance, currency, icon })
    setName('');
    setBalance();
    setCurrency('');
    setIcon('');

    home();
  }

  const onBack = (e) => {
    e.preventDefault();

    setName('');
    setBalance();
    setCurrency('');
    setIcon('');

    home();
  }

  return (
    <div>
      <div className="inputBox">
        <div className="inputContainer">
          <p className="inputText">Account name</p>
          <input
            type="text"
            value={!name ? '' : name}
            placeholder="Enter name"
            className={cn("input", errors.name ? "error" : "")}
            required
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div className="inputContainer">
          <p className="inputText">Balance</p>
          <input
            type="number"
            step="0.01"
            min="0"
            value={balance === 0 ? '' : balance}
            placeholder="Enter balance"
            className={cn("input", errors.balance ? "error" : "")}
            required
            onChange={(e) => setBalance(limitToTwoDecimals(e.target.value) || 0)}
          />
        </div>
        <div className="inputContainer">
          <p className="inputText">Currency</p>
          <select
            className={cn("input", errors.currency ? "error" : "")}
            value={currency}
            required
            onChange={(e) => setCurrency(e.target.value)}
          >
            <option value="" disabled>Select Currecny</option>
            {accountCurrency.map((currency, index) => (
              <option key={index} value={currency}>{currency}</option>
            ))}
          </select>
        </div>
        <div className="inputContainer">
          <p className="inputText">Icon</p>
          <select
            className={cn("input", errors.icon ? "error" : "")}
            value={icon}
            required
            onChange={(e) => setIcon(e.target.value)}
          >
            <option value="" disabled>Select Icon</option>
            {accountIcon.map((icon, index) => (
              <option key={index} value={icon}>{icon}</option>
            ))}
          </select>
        </div>
      </div>
      <div className="buttonContainer">
        <button className="backBtn button" onClick={onBack}>Back</button>
        <button className="saveBtn button" onClick={onSubmit}>Save</button>
      </div>
    </div>
  )
}

export default AddAccount
