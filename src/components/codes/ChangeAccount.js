import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

const ChangeAccount = ({ account, changeAccount, deleteAccount }) => {
  const navigate = useNavigate();
  function home() {
    navigate('/');
  }

  const [name, setName] = useState(account.name);
  const [balance, setBalance] = useState(account.balance);
  const [currency, setCurrency] = useState(account.currency);
  const [icon, setIcon] = useState(account.icon);

  useEffect(() => {
    setName(account.name);
    setBalance(account.balance);
    setCurrency(account.currency);
    setIcon(account.icon);
  }, [account]);

  let id = account.id

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
            <option value="UAH">UAH</option>
            <option value="PLN">PLN</option>
            <option value="USD">USD</option>
            <option value="CAD">CAD</option>
          </select>
        </div>
        <div className="inputContainer">
          <p className="inputText">Icon</p>
          <select className="input" value={icon} required onChange={(e) => setIcon(e.target.value)}>
            <option value="card_blue">Blue card</option>
            <option value="card_pink">Pink card</option>
            <option value="cash">Cash</option>
            <option value="crypto">Crypto</option>
            <option value="bank">Bank account</option>
            <option value="euro">Euro</option>
            <option value="usd">USD</option>
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