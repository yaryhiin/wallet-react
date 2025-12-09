import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { loadData, limitToTwoDecimals } from '../../utils';
import styles from '../styles/FormLayout.module.scss'
import cn from 'classnames';

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
    setBalance(0);
    setCurrency('');
    setIcon('');

    home();
  }

  const onDelete = (e) => {
    e.preventDefault();

    if (!window.confirm(`This account has ${account.balance} ${account.currency}. Are you sure?`)) {
      return;
    }

    setName('');
    setBalance(0);
    setCurrency('');
    setIcon('');

    deleteAccount(id);

    home();
  }

  return (
    <div>
      <div className={styles.inputBox}>
        <div className={styles.inputContainer}>
          <p className={styles.inputText}>Account name</p>
          <input
            type="text"
            value={name}
            className={cn(styles.input, errors.name && styles.error)}
            required
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div className={styles.inputContainer}>
          <p className={styles.inputText}>Balance</p>
          <input
            type="number"
            step="0.01"
            value={balance}
            className={cn(styles.input, errors.balance && styles.error)}
            required
            onChange={(e) => setBalance(limitToTwoDecimals(e.target.value) || 0)}
          />
        </div>

        <div className={styles.inputContainer}>
          <p className={styles.inputText}>Currency</p>
          <select
            className={cn(styles.input, errors.currency && styles.error)}
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

        <div className={styles.inputContainer}>
          <p className={styles.inputText}>Icon</p>
          <select
            className={cn(styles.input, errors.icon && styles.error)}
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
      <div className={styles.buttonContainer}>
        <button className="backBtn button" onClick={onBack}>Back</button>
        <button className={cn(styles.changeBtn, "button")} onClick={onSubmit}>Change</button>
        <button className={cn(styles.deleteBtn, "button")} onClick={onDelete}>Delete</button>
      </div>
    </div>
  )
}

export default ChangeAccount