import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { loadData, limitToTwoDecimals, getInputClass } from '../../utils';

const ChangeAccount = ({ changeAccount, deleteAccount }) => {
  const navigate = useNavigate();
  function home() {
    navigate('/');
  }

  const [errors, setErrors] = useState({});

  const accounts = loadData("accounts");
  const { id } = useParams();
  const account = accounts.find(a => a.id === id);

  const accountCurrency = ["UAH", "PLN", "USD", "CAD"];
  const accountIcon = ["card_blue", "card_pink", "cash", "crypto", "bank", "euro", "usd"];

  const [name, setName] = useState(account.name);
  const [balance, setBalance] = useState(account.balance);
  const [currency, setCurrency] = useState(account.currency);
  const [icon, setIcon] = useState(account.icon);

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

    changeAccount({ id, name, balance, currency, icon })
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

  const onDelete = (e) => {
    e.preventDefault();

    setName('');
    setBalance();
    setCurrency('');
    setIcon('');

    deleteAccount(id);

    home();
  }

  return (
    <>
      <div className="inputBox">
        <div className="inputContainer">
          <p className="inputText">Account name</p>
          <input type="text" value={name} className={getInputClass('name', errors)} required onChange={(e) => setName(e.target.value)} />
        </div>
        <div className="inputContainer">
          <p className="inputText">Balance</p>
          <input type="number" step="0.01" value={balance} className={getInputClass('balance', errors)} required onChange={(e) => setBalance(limitToTwoDecimals(e.target.value) || 0)} />
        </div>
        <div className="inputContainer">
          <p className="inputText">Currency</p>
          <select className={getInputClass('currency', errors)} value={currency} required onChange={(e) => setCurrency(e.target.value)}>
            <option value="" disabled>Select Currecny</option>
            {accountCurrency.map((currency, index) => (
              <option key={index} value={currency}>{currency}</option>
            ))}
          </select>
        </div>
        <div className="inputContainer">
          <p className="inputText">Icon</p>
          <select className={getInputClass('icon', errors)} value={icon} required onChange={(e) => setIcon(e.target.value)}>
            <option value="" disabled>Select Icon</option>
            {accountIcon.map((icon, index) => (
              <option key={index} value={icon}>{icon}</option>
            ))}
          </select>
        </div>
      </div>
      <div className="buttonContainer">
        <button className="backBtn button" onClick={onBack}>Back</button>
        <button className="changeBtn button" onClick={onSubmit}>Change</button>
        <button className="deleteBtn button" onClick={onDelete}>Delete</button>
      </div>
    </>
  )
}

export default ChangeAccount