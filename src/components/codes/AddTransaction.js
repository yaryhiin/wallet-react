import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { getFormattedLocalDateTime } from '../../utils';
import Modal from './Modal'
import styles from '../styles/FormLayout.module.scss'
import cn from 'classnames';
import MessageModal from './MessageModal';

const AddTransaction = ({ addTransaction, type, accounts, addCategory, categories, deleteCategory }) => {

  const [options, setOptions] = useState([]);

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

  const navigate = useNavigate();
  function home() {
    navigate('/');
  }

  const formattedDate = getFormattedLocalDateTime(new Date());

  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState('');
  const [method, setMethod] = useState('');
  const [date, setDate] = useState(formattedDate);

  useEffect(() => {
    setOptions(categories.filter((c) => c.type === type));
  }, [categories, type]);

  const title = "Confirm Action";
  const text = `Are you sure you want to delete the category "${category}"? \n This action cannot be undone.`;

  async function handleDeleteCategory() {
    const chosenCategory = options.find((o) => o.name === category);
    const deletedCategory = await deleteCategory(chosenCategory.id);
    if (!deletedCategory) return;
    setOptions((prev) => prev.filter((p) => p.id !== chosenCategory.id));
    setShowMessageModal(false);
  }

  const onSubmit = async (e) => {
    e.preventDefault();

    const newErrors = {};

    const numericAmount =
      amount === "" ? 0 : Math.trunc(Number(amount) * 100) / 100;
    if (!numericAmount || numericAmount <= 0 || numericAmount > 999999999) newErrors.amount = true;
    if (!category) newErrors.category = true;
    if (!method) newErrors.method = true;
    if (!date) newErrors.date = true;

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const accountWithMethod = accounts.find((account) => account.id === method);

    if (!accountWithMethod) {
      setErrors((prev) => ({ ...prev, method: true }));
      return;
    }
    await addTransaction({ category, amount: numericAmount, currency: accountWithMethod.currency, type, method, date }, accountWithMethod)

    setAmount("");
    setCategory('');
    setMethod('');
    setDate(formattedDate);

    home();
  }

  const onBack = (e) => {
    e.preventDefault();

    setAmount("");
    setCategory('');
    setMethod('');
    setDate(formattedDate);

    home();
  }

  return (
    <div className={styles.formContainer}>
      <h1 className={styles.heading}>Add Transaction</h1>
      <div className={styles.inputBox}>
        <div className={styles.inputContainer}>
          <p className={styles.inputText}>Amount</p>
          <input
            className={cn(styles.input, errors.amount && styles.error)}
            value={amount}
            placeholder="Enter amount"
            type="text"
            inputMode="decimal"
            required
            onChange={(e) => {
              const value = e.target.value;

              if (/^\d*\.?\d{0,2}$/.test(value)) {
                setAmount(value);
              }
            }}
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
      </div>
    </div>
  )
}

export default AddTransaction
