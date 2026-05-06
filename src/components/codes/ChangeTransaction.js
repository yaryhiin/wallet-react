import { useNavigate, useParams, useLocation } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { limitToDecimals, getFormattedLocalDateTime } from '../../utils';
import Modal from './Modal';
import MessageModal from './MessageModal';
import styles from '../styles/FormLayout.module.scss'
import cn from 'classnames';

const ChangeTransaction = ({ accounts, transactions, changeTransaction, deleteTransaction, addCategory, categories, deleteCategory }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from || '/';
  function home() {
    navigate(from);
  }

  const [errors, setErrors] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [showMessageModal, setShowMessageModal] = useState(false);

  async function handleAddCategory(newCategory) {
    const updatedCategory = await addCategory({ type: type, name: newCategory });
    if (!updatedCategory) return
    setOptions((prev) => [...prev, updatedCategory]);
    setCategory(newCategory);
    setShowModal(false);
  }

  const { id } = useParams();

  const transaction = transactions.find(
    (t) => String(t.id) === String(id)
  );

  const [type, setType] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [method, setMethod] = useState('');
  const [date, setDate] = useState('');
  const [options, setOptions] = useState([]);

  useEffect(() => {
    if (!transaction) return;

    setType(transaction.type);
    setAmount(transaction.amount);
    setCategory(transaction.category);
    setMethod(transaction.method);
    setDate(transaction.date);
  }, [transaction]);

  useEffect(() => {
    setOptions(categories.filter((c) => c.type === type));
  }, [type, categories]);

  if (!transaction) {
    return <p>Loading transaction...</p>;
  }

  const title = "Confirm Action";
  const text = `Are you sure you want to delete the category "${category}"? \n This action cannot be undone.`;

  async function handleDeleteCategory() {
    const chosenCategory = options.find((o) => o.name === category);
    const deletedCategory = await deleteCategory(chosenCategory.id);
    if (!deletedCategory) return;
    setOptions((prev) => prev.filter((p) => p.id !== chosenCategory.id));
    setShowMessageModal(false);
  }

  let currency = transaction.currency;

  const onSubmit = (e) => {
    e.preventDefault();

    const newErrors = {};
    if (!amount || amount <= 0 || amount > 999999999) newErrors.amount = true;
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
    <div className={styles.formContainer}>
      <h1 className={styles.heading}>Change Transaction</h1>
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
            value={amount === 0 ? '' : amount}
            placeholder="Enter amount"
            type="number"
            step="0.01"
            min="0"
            max="999999999"
            required
            onChange={(e) => setAmount(limitToDecimals(e.target.value, 2) || 0)}
          />
        </div>

        <div className={styles.inputContainer}>
          <p className={styles.inputText}>Category</p>
          <div className={styles.fieldRow}>
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
              {options.map((c) => (
                <option key={c.id} value={c.name}>{c.name}</option>
              ))}
              <option value="__add_new_category__">+ Add new category</option>
            </select>
            <button className={cn(styles.deleteCategoryBtn, styles.deleteBtn, "button")} onClick={() => setShowMessageModal(true)}>🗑️</button>
          </div>
        </div>
        {showMessageModal && <MessageModal title={title} text={text} onDelete={handleDeleteCategory} onClose={() => setShowMessageModal(false)} />}

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

        <div className={cn(styles.inputContainer, styles.fullWidth)}>
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