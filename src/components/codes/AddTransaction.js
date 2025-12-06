import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { limitToTwoDecimals, getFormattedLocalDateTime, getInputClass } from '../../utils';
import Modal from './Modal'

const AddTransaction = ({ addTransaction, type, accounts, addCategory, categories, deleteCategory }) => {

  const options = type === "expense" ? categories.expense : categories.income

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

  const navigate = useNavigate();
  function home() {
    navigate('/');
  }

  const formattedDate = getFormattedLocalDateTime(new Date());

  const [amount, setAmount] = useState(0);
  const [category, setCategory] = useState('');
  const [method, setMethod] = useState('');
  const [date, setDate] = useState(formattedDate);

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

    const accountWithMethod = accounts.find((account) => account.id === method);
    const changedAmount = type === 'expense' ? -amount : amount
    addTransaction({ category, amount: changedAmount, currency: accountWithMethod.currency, type, method, date }, accountWithMethod)

    setAmount(0);
    setCategory('');
    setMethod('');
    setDate(formattedDate);

    home();
  }

  const onBack = (e) => {
    e.preventDefault();

    setAmount(0);
    setCategory('');
    setMethod('');
    setDate(formattedDate);

    home();
  }

  return (
    <>
      <div className="inputBox">
        <div className="inputContainer">
          <p className="inputText">Amount</p>
          <input
            min="1"
            className={getInputClass('amount', errors)}
            value={amount === 0 ? '' : amount}
            placeholder="Enter amount"
            type="number"
            step="0.01"
            required
            onChange={(e) => setAmount(limitToTwoDecimals(e.target.value) || 0)}
          />
        </div>
        <div className="inputContainer">
          <p className="inputText">Category</p>
          <select
            className={getInputClass('category', errors)}
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
          <button className="button deleteBtn deleteCategoryBtn" onClick={() => handleDeleteCategory(category)}>🗑️</button>
        </div>
        {showModal && <Modal onAddCategory={handleAddCategory} onClose={() => setShowModal(false)} />}
        <div className="inputContainer">
          <p className="inputText">Method</p>
          <select
            className={getInputClass('method', errors)}
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
        <div className="inputContainer">
          <p className="inputText">Date</p>
          <input
            type="datetime-local"
            className={getInputClass('date', errors)}
            value={date}
            required
            onChange={(e) => setDate(getFormattedLocalDateTime(e.target.value))}
          />
        </div>
      </div>
      <div className="buttonContainer">
        <button className="backBtn button" onClick={onBack}>Back</button>
        <button className="saveBtn button" onClick={onSubmit}>Save</button>
      </div>

    </>
  )
}

export default AddTransaction
