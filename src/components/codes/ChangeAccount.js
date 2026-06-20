import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { fetchCurrencies } from '../../utils';
import styles from '../styles/FormLayout.module.scss'
import cn from 'classnames';
import MessageModal from './MessageModal';

const ChangeAccount = ({ accounts, changeAccount, deleteAccount }) => {
  const navigate = useNavigate();
  function home() {
    navigate('/');
  }

  const [errors, setErrors] = useState({});

  const [accountCurrency, setAccountCurrency] = useState([]);

  useEffect(() => {
    async function loadCurrencies() {
      const currencies = await fetchCurrencies();
      setAccountCurrency(currencies);
    }
    loadCurrencies()
  }, []);
  const accountIcon = [
    { value: "card_blue", name: "Card Blue" },
    { value: "card_pink", name: "Card Pink" },
    { value: "cash", name: "Cash" },
    { value: "crypto", name: "Crypto" },
    { value: "bank", name: "Bank" },
    { value: "euro", name: "Euro" },
    { value: "usd", name: "USD" }
  ];

  const { id } = useParams();

  const account = accounts.find((a) => String(a.id) === String(id));

  const [name, setName] = useState('');
  const [balance, setBalance] = useState('');
  const [currency, setCurrency] = useState('');
  const [icon, setIcon] = useState('');
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (!account) return;

    setName(account.name);
    setBalance(account.balance);
    setCurrency(account.currency);
    setIcon(account.icon);
  }, [account]);

  if (!account) {
    return <p>Loading account...</p>;
  }
  const title = "Confirm Action";
  const text = `This account has ${balance} ${currency}. \n You sure you want to delete it?`;

  const onSubmit = async (e) => {
    e.preventDefault();

    const newErrors = {};
    const numericBalance = balance === "" ? 0 : Number(balance);
    if (!name) newErrors.name = true;
    if (numericBalance === '' || numericBalance < -999999999 || numericBalance > 999999999) newErrors.balance = true;
    if (!currency) newErrors.currency = true;
    if (!icon) newErrors.icon = true;

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    await changeAccount({ id, name, balance: numericBalance, currency, icon })
    setName('');
    setBalance("");
    setCurrency('');
    setIcon('');

    home();
  }

  const onBack = (e) => {
    e.preventDefault();

    setName('');
    setBalance("");
    setCurrency('');
    setIcon('');

    home();
  }

  function handleDeleteAccount() {
    setShowModal(false);
    setName('');
    setBalance("");
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
            value={!name ? '' : name}
            placeholder="Enter name"
            className={cn(styles.input, errors.name && styles.error)}
            required
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div className={styles.inputContainer}>
          <p className={styles.inputText}>Balance</p>
          <input
            value={balance}
            placeholder="Enter balance"
            className={cn(styles.input, errors.balance && styles.error)}
            type="text"
            inputMode="decimal"
            required
            onChange={(e) => {
              const value = e.target.value;

              if (/^\d*\.?\d{0,2}$/.test(value)) {
                setBalance(value);
              }
            }}
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
              <option key={index} value={currency.iso_code}>{currency.iso_code} - {currency.name}</option>
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