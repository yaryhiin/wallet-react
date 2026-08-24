import { useNavigate, useParams, useLocation } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { getFormattedLocalDateTime } from '../../utils';
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

  const [transaction, setTransaction] = useState()

  const [errors, setErrors] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [showMessageModal, setShowMessageModal] = useState(false);

  async function handleAddCategory(newCategory) {
    const updatedCategory = await addCategory({ type: transaction.type, name: newCategory });
    if (!updatedCategory) return
    setOptions((prev) => [...prev, updatedCategory]);
    setTransaction((prev) => ({ ...prev, category: newCategory }))
    setShowModal(false);
  }

  const { id } = useParams();

  useEffect(() => {

    if (!transactions) return;
    const savedTransaction = localStorage.getItem("transaction");
    if (savedTransaction) {
      setTransaction(JSON.parse(savedTransaction))
    } else {
      localStorage.removeItem("transaction");
      setTransaction(transactions.find(
        (t) => String(t.id) === String(id)
      ) ?? { type: "", amount: "", category: "", accountId: 0, date: "" }
      )
    }

  }, [transactions, id])

  const [options, setOptions] = useState([]);



  useEffect(() => {
    if (transaction) localStorage.setItem("transaction", JSON.stringify(transaction))
  }, [transaction]);

  useEffect(() => {
    if (transaction?.type)
      setOptions(categories.filter((c) => c.type === transaction.type));
  }, [transaction?.type, categories]);

  if (!transaction) {
    return <p>Loading transaction...</p>;
  }

  const title = "Confirm Action";
  const text = `Are you sure you want to delete the category "${transaction.category}"? \n This action cannot be undone.`;

  async function handleDeleteCategory() {
    const chosenCategory = options.find((o) => o.name === transaction.category);
    const deletedCategory = await deleteCategory(chosenCategory.id);
    if (!deletedCategory) return;
    setOptions((prev) => prev.filter((p) => p.id !== chosenCategory.id));
    setShowMessageModal(false);
  }

  let currency = transaction.currency;

  const onSubmit = async (e) => {
    e.preventDefault();

    const newErrors = {};
    const numericAmount = transaction.amount === "" ? 0 : Number(transaction.amount);
    if (!numericAmount || numericAmount <= 0 || numericAmount > 999999999) newErrors.amount = true;
    if (!transaction.category) newErrors.category = true;
    if (!transaction.accountId) newErrors.accountId = true;
    if (!transaction.date) newErrors.date = true;

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    await changeTransaction({ id, category: transaction.category, amount: numericAmount, currency, type: transaction.type, account_id: transaction.accountId, date: transaction.date })



    home();
    localStorage.removeItem("transaction");
  }

  const onBack = (e) => {
    e.preventDefault();



    home();
    localStorage.removeItem("transaction");
  }

  const onDelete = async (e) => {
    e.preventDefault();

    setTransaction({ type: "", amount: "", category: "", accountId: 0, date: "" })


    await deleteTransaction(id);

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
            value={transaction.type}
            required
            onChange={(e) => setTransaction((prev) => ({ ...prev, type: e.target.value }))}
          >
            <option value="income">Income</option>
            <option value="expense">Expense</option>
          </select>
        </div>

        <div className={styles.inputContainer}>
          <p className={styles.inputText}>Amount</p>
          <input
            className={cn(styles.input, errors.amount && styles.error)}
            value={transaction.amount}
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

        <div className={cn(styles.inputContainer, styles.fullWidth)}>
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
        <button className={cn(styles.deleteBtn, "button")} onClick={onDelete}>Delete</button>
      </div>
    </div >
  )
}

export default ChangeTransaction