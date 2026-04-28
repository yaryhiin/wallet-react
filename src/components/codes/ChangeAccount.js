import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { loadData, limitToTwoDecimals } from '../../utils';
import styles from '../styles/FormLayout.module.scss'
import cn from 'classnames';
import MessageModal from './MessageModal';

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
  const accountIcon = [
    { value: "card_blue", name: "Card Blue" },
    { value: "card_pink", name: "Card Pink" },
    { value: "cash", name: "Cash" },
    { value: "crypto", name: "Crypto" },
    { value: "bank", name: "Bank" },
    { value: "euro", name: "Euro" },
    { value: "usd", name: "USD" }
  ];

  const [name, setName] = useState(account.name);
  const [balance, setBalance] = useState(account.balance);
  const [currency, setCurrency] = useState(account.currency);
  const [icon, setIcon] = useState(account.icon);

  const [showModal, setShowModal] = useState(false);
  const title = "Confirm Action";
  const text = `This account has ${account.balance} ${account.currency}. \n You sure you want to delete it?`;

  const onSubmit = (e) => {
    e.preventDefault();

    const newErrors = {};
    if (!name) newErrors.name = true;
    if (!balance || balance < -999999999 || balance > 999999999) newErrors.balance = true;
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

  function handleDeleteAccount() {
    setShowModal(false);
    setName('');
    setBalance(0);
    setCurrency('');
    setIcon('');

    deleteAccount(id);

    home();
  }

  const onDelete = (e) => {
    e.preventDefault();
    setShowModal(true);
  }

  return (
    <div className={styles.formContainer}>
      <h1 className={styles.heading}>Change Account</h1>
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
            min="-999999999"
            max="999999999"
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
              <option key={index} value={icon.value}>{icon.name}</option>
            ))}
          </select>
        </div>
        {showModal && <MessageModal title={title} text={text} onDelete={handleDeleteAccount} onClose={() => setShowModal(false)} />}
      </div>
      <div className={styles.buttonContainer}>
        <button className="backBtn button" onClick={onBack}>Back</button>
        <button className={cn(styles.saveBtn, "button")} onClick={onSubmit}>Save</button>
        <button className={cn(styles.deleteBtn, "button")} onClick={onDelete}>Delete</button>
      </div>
    </div>
  )
}

export default ChangeAccount