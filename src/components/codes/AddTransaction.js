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
    const updatedCategory = await addCategory({ type, name: newCategory });
    if (!updatedCategory) return
    setOptions((prev) => [...prev, updatedCategory]);
    setTransaction((prev) => ({ ...prev, category: newCategory }));
    setShowModal(false);
  }

  const navigate = useNavigate();
  function home() {
    navigate('/');
  }

  const formattedDate = getFormattedLocalDateTime(new Date());

  const [transaction, setTransaction] = useState(getInitialTransaction)

  function getInitialTransaction() {
    const savedTransaction = localStorage.getItem("transaction");
    if (savedTransaction) {
      return JSON.parse(savedTransaction)
    } else {
      localStorage.removeItem("transaction");
      return {
        amount: "",
        category: categories[0].name,
        accountId: accounts[0].id,
        date: formattedDate
      }
    }
  }

  useEffect(() => {
    setOptions(categories.filter((c) => c.type === type));
  }, [categories, type]);

  useEffect(() => {
    if (transaction) localStorage.setItem("transaction", JSON.stringify(transaction))
  }, [transaction])

  const title = "Confirm Action";
  const text = `Are you sure you want to delete the category "${transaction.category}"? \n This action cannot be undone.`;

  async function handleDeleteCategory() {
    const chosenCategory = options.find((o) => o.name === transaction.category);
    const deletedCategory = await deleteCategory(chosenCategory.id);
    if (!deletedCategory) return;
    setOptions((prev) => prev.filter((p) => p.id !== chosenCategory.id));
    setShowMessageModal(false);
  }

  const onSubmit = async (e) => {
    e.preventDefault();

    const newErrors = {};

    const numericAmount =
      transaction.amount === "" ? 0 : Math.trunc(Number(transaction.amount) * 100) / 100;
    if (!numericAmount || numericAmount <= 0 || numericAmount > 999999999) newErrors.amount = true;
    if (!transaction.category) newErrors.category = true;
    if (!transaction.accountId) newErrors.accountId = true;
    if (!transaction.date) newErrors.date = true;

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const accountWithMethod = accounts.find((account) => account.id === transaction.accountId);

    if (!accountWithMethod) {
      setErrors((prev) => ({ ...prev, accountId: true }));
      return;
    }
    await addTransaction({ category: transaction.category, amount: numericAmount, currency: accountWithMethod.currency, type, account_id: transaction.accountId, date: transaction.date }, accountWithMethod)


    home();
    localStorage.removeItem("transaction")
  }

  const onBack = (e) => {
    e.preventDefault();




    home();
    localStorage.removeItem("transaction");
  }

  return (
    <div className={styles.formContainer}>
      <h1 className={styles.heading}>Add Transaction</h1>
      <div className={styles.inputBox}>
        <div className={styles.inputContainer}>
          <p className={styles.inputText}>Amount</p>
          <input
            className={cn(styles.input, errors.amount && styles.error)}
            value={transaction.amount}
            placeholder="Enter amount"
            type="number"
            required
            onChange={(e) => {
              setTransaction((prev) => ({ ...prev, amount: e.target.value }));

            }}
          />
        </div>

        <div className={styles.inputContainer}>
          <p className={styles.inputText}>Category</p>
          <div className={styles.fieldRow}>
            <select
              className={cn(styles.input, errors.category && styles.error)}
              value={transaction.category}
              required
              onChange={(e) => {
                if (e.target.value === "__add_new_category__") {
                  setShowModal(true);
                  return;
                }
                setTransaction((prev) => ({ ...prev, category: e.target.value }))
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
            className={cn(styles.input, errors.accountId && styles.error)}
            value={transaction.accountId}
            required
            onChange={(e) => setTransaction((prev) => ({ ...prev, accountId: e.target.value }))}
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
            value={transaction.date}
            required
            onChange={(e) => setTransaction((prev) => ({ ...prev, date: getFormattedLocalDateTime(e.target.value) }))}
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
