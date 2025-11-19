import { useNavigate } from 'react-router-dom'
import { useState } from 'react'
import styles from '../styles/AddAccount.module.css'
import cn from 'classnames'

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
        if(!name) newErrors.name = true;
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
            <div className={styles.inputsBox}>
                <div className={styles.inputContainer}>
                    <p className={styles.inputText}>Account name</p>
                    <input type="text" value={!name ? '' : name} placeholder='Enter name' className={cn(styles.input, styles.accName, errors.name ? styles.error : '')} required onChange={(e) => setName(e.target.value)} />
                </div>
                <div className={styles.inputContainer}>
                    <p className={styles.inputText}>Balance</p>
                    <input type="number" min="0" value={balance === 0 ? '' : balance} placeholder='Enter balance' className={cn(styles.input, styles.accBal, errors.balance ? styles.error : '')} required onChange={(e) => setBalance(parseInt(e.target.value) || 0)} />
                </div>
                <div className={styles.inputContainer}>
                    <p className={styles.inputText}>Currency</p>
                    <select className={cn(styles.accCur, errors.currency ? styles.error : '')} value={currency} required onChange={(e) => setCurrency(e.target.value)}>
                        <option value="" disabled>Select Currecny</option>
                        {accountCurrency.map((currency, index) => <option key={index} value={currency}>{currency}</option>)}
                    </select>
                </div>
                <div className={styles.inputContainer}>
                    <p className={styles.inputText}>Icon</p>
                    <select className={cn(styles.accIcon, errors.icon ? styles.error : '')} value={icon} required onChange={(e) => setIcon(e.target.value)}>
                        <option value="" disabled>Select Icon</option>
                        {accountIcon.map((icon, index) => <option key={index} value={icon}>{icon}</option>)}
                    </select>
                </div>
            </div>
            <div className={styles.buttonContainer}>
                <button className={styles.backBtn} onClick={onBack}>Back</button>
                <button className={styles.saveAccBtn} onClick={onSubmit}>Save</button>
            </div>

        </div>
    )
}

export default AddAccount
