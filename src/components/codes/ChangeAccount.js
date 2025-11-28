import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { loadData } from '../../utils';

const ChangeAccount = ({ changeAccount, deleteAccount }) => {
  const navigate = useNavigate();
  function home() {
    navigate('/');
  }

  const accounts = loadData("accounts");
  const { id } = useParams();
  const account = accounts.find(a => a.id === Number(id));

  const accountCurrency = ["UAH", "PLN", "USD", "CAD"];
  const accountIcon = ["card_blue", "card_pink", "cash", "crypto", "bank", "euro", "usd"];

  const [name, setName] = useState(account.name);
  const [balance, setBalance] = useState(account.balance);
  const [currency, setCurrency] = useState(account.currency);
  const [icon, setIcon] = useState(account.icon);

  const onSubmit = (e) => {
    e.preventDefault();
    if (name !== "") {
      changeAccount({ id, name, balance, currency, icon })
      setName('');
      setBalance();
      setCurrency('');
      setIcon('');

      home();
    } else {
      alert("You forgot to write the name")
    }
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
          <input type="text" value={name} className="input" required onChange={(e) => setName(e.target.value)} />
        </div>
        <div className="inputContainer">
          <p className="inputText">Balance</p>
          <input type="number" value={balance} className="input" required onChange={(e) => setBalance(parseInt(e.target.value) || 0)} />
        </div>
        <div className="inputContainer">
          <p className="inputText">Currency</p>
          <select className="input" value={currency} required onChange={(e) => setCurrency(e.target.value)}>
            <option value="" disabled>Select Currecny</option>
            {accountCurrency.map((currency, index) => (
              <option key={index} value={currency}>{currency}</option>
            ))}
          </select>
        </div>
        <div className="inputContainer">
          <p className="inputText">Icon</p>
          <select className="input" value={icon} required onChange={(e) => setIcon(e.target.value)}>
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