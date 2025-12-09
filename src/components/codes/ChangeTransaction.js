import { useNavigate, useParams } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { loadData, limitToTwoDecimals, getFormattedLocalDateTime } from '../../utils';
import Modal from './Modal';
import styles from '../styles/FormLayout.module.scss'
import cn from 'classnames';

const ChangeTransaction = ({ changeTransaction, deleteTransaction, addCategory, categories, deleteCategory }) => {
  const navigate = useNavigate();
  function home() {
    navigate('/');
  }

  const [errors, setErrors] = useState({});
  const [showModal, setShowModal] = useState(false);

  function handleAddCategory(newCategory) {
    addCategory(type, newCategory);
    setShowModal(false);
  }

  function handleDeleteCategory(category) {
    window.confirm(`Are you sure you want to delete the category "${category}"? This action cannot be undone.`) &&
      deleteCategory(type, category);
  }

  const accounts = loadData("accounts");
  const transactions = loadData("transactions");
  const { id } = useParams();
  const transaction = transactions.find(t => t.id === id);

  const [type, setType] = useState(transaction.type);
  const [amount, setAmount] = useState(transaction.amount);
  const [category, setCategory] = useState(transaction.category);
  const [method, setMethod] = useState(transaction.method);
  const [date, setDate] = useState(transaction.date);

  const [options, setOptions] = useState(categories[type]);

  useEffect(() => {
    setOptions(categories[type]);
  }, [type, categories]);

  let currency = transaction.currency;

  const onSubmit = (e) => {
    e.preventDefault();

    const newErrors = {};
    if (!amount || amount <= 0) newErrors.amount = true;
    if (!category) newErrors.category = true;
    if (!method) newErrors.method = true;
    if (!date) newErrors.date = true;

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    changeTransaction({ id, category, amount, currency, type, method, date })

    setType('');
    setAmount(0);
    setCategory('');
    setMethod(0);
    setDate('');

    home();
  }

  const onBack = (e) => {
    e.preventDefault();

    setType('');
    setAmount(0);
    setCategory('');
    setMethod(0);
    setDate('');

    home();
  }

  const onDelete = (e) => {
    e.preventDefault();

    setType('');
    setAmount(0);
    setCategory('');
    setMethod(0);
    setDate('')

    deleteTransaction(id);

    home();
  }

  return (
    <div>
      <div className={styles.inputBox}>
        <div className={styles.inputContainer}>
          <p className={styles.inputText}>Type</p>
          <select
            className={cn(styles.input)}
            value={type}
            required
            onChange={(e) => setType(e.target.value)}
          >
            <option value="income">Income</option>
            <option value="expense">Expense</option>
          </select>
        </div>

        <div className={styles.inputContainer}>
          <p className={styles.inputText}>Amount</p>
          <input
            className={cn(styles.input, errors.amount && styles.error)}
            value={amount}
            type="number"
            step="0.01"
            required
            onChange={(e) => setAmount(limitToTwoDecimals(e.target.value) || 0)}
          />
        </div>

        <div className={styles.inputContainer}>
          <p className={styles.inputText}>Category</p>
          <select
            className={cn(styles.input, errors.category && styles.error)}
            value={category}
            required
            onChange={(e) => {
              if (e.target.value === "__add_new_category__") {
                setShowModal(true);
                return;
              }
              setCategory(e.target.value)
            }}
          >
            <option value="" disabled>Select Category</option>
            {options.map((method, index) => (
              <option key={index} value={method}>{method}</option>
            ))}
            <option value="__add_new_category__">+ Add new category</option>
          </select>
          <button className={cn(styles.deleteCategoryBtn, styles.deleteBtn, "button")} onClick={() => handleDeleteCategory(category)}>🗑️</button>
        </div>

        {showModal && <Modal onAddCategory={handleAddCategory} onClose={() => setShowModal(false)} />}

        <div className={styles.inputContainer}>
          <p className={styles.inputText}>Method</p>
          <select
            className={cn(styles.input, errors.method && styles.error)}
            value={method}
            required
            onChange={(e) => setMethod(e.target.value)}
          >
            <option value="" disabled>Select Method</option>
            {accounts.map((account) => (
              <option key={account.id} value={account.id}>{account.name}</option>
            ))}
          </select>
        </div>

        <div className={styles.inputContainer}>
          <p className={styles.inputText}>Date</p>
          <input
            type="datetime-local"
            className={cn(styles.input, errors.date && styles.error)}
            value={date}
            required
            onChange={(e) => setDate(getFormattedLocalDateTime(e.target.value))}
          />
        </div>
      </div>

      <div className={styles.buttonContainer}>
        <button className="backBtn button" onClick={onBack}>Back</button>
        <button className={cn(styles.saveBtn, "button")} onClick={onSubmit}>Save</button>
        <button className={cn(styles.deleteBtn, "button")} onClick={onDelete}>Delete</button>
      </div>
    </div >
  )
}

export default ChangeTransaction