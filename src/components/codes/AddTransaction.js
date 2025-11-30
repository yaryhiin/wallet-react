import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import cn from 'classnames';
import { limitToTwoDecimals, getFormattedLocalDateTime } from '../../utils';

const AddTransaction = ({ addTransaction, type, accounts }) => {

  const incomeMethod = ["Salary", "Crypto", "Interests", "Business", "Gifts", "Rewards", "Side Hustle"];
  const expenseMethod = ["Food", "Rent", "Utilities", "Entertainment", "Transportation", "Healthcare", "Shopping", "Subscriptions", "Education", "Travel"];

  const options = type === "expense" ? expenseMethod : incomeMethod

  const [errors, setErrors] = useState({});

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
    setMethod(0);
    setDate(formattedDate);

    home();
  }

  const onBack = (e) => {
    e.preventDefault();

    setAmount(0);
    setCategory('');
    setMethod(0);
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
            className={cn("input", errors.amount ? "error" : "")}
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
            className={cn("input", errors.category ? "error" : "")}
            value={category}
            required
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="" disabled>Select Category</option>
            {options.map((method, index) => (
              <option key={index} value={method}>{method}</option>
            ))}
          </select>
        </div>
        <div className="inputContainer">
          <p className="inputText">Method</p>
          <select
            className={cn("input", errors.method ? "error" : "")}
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
            className={cn("input", errors.date ? "error" : "")}
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
