import { useNavigate, useParams } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { loadData, limitToTwoDecimals, getFormattedLocalDateTime, getInputClass } from '../../utils';
import Modal from './Modal';

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
        <>
            <div className="inputBox">
                <div className="inputContainer">
                    <p className="inputText">Type</p>
                    <select className="input" value={type} required onChange={(e) => setType(e.target.value)}>
                        <option value="income">Income</option>
                        <option value="expense">Expense</option>
                    </select>
                </div>
                <div className="inputContainer">
                    <p className="inputText">Amount</p>
                    <input
                        className={getInputClass('amount', errors)}
                        value={amount}
                        type="number"
                        step="0.01"
                        required
                        onChange={(e) => setAmount(limitToTwoDecimals(e.target.value) || 0)}
                    />
                </div>
                <div className="inputContainer">
                    <p className="inputText">Category</p>
                    <select className={getInputClass('category', errors)} value={category} required onChange={(e) => setCategory(e.target.value)}>
                        <option value="" disabled>Select Category</option>
                        {options.map((c, i) => (
                            <option key={i} value={c}>{c}</option>
                        ))}
                        <option value="__add_new_category__">+ Add new category</option>
                    </select>
                    <button className="button deleteBtn deleteCategoryBtn" onClick={() => handleDeleteCategory(category)}>🗑️</button>
                </div>
                {showModal && <Modal onAddCategory={handleAddCategory} onClose={() => setShowModal(false)} />}
                <div className="inputContainer">
                    <p className="inputText">Method</p>
                    <select className={getInputClass('method', errors)} value={method} required onChange={(e) => setMethod(e.target.value)}>
                        <option value="" disabled>Select Method</option>
                        {accounts.map((account) => (
                            <option key={account.id} value={account.id}>{account.name}</option>
                        ))}
                    </select>
                </div>
                <div className="inputContainer">
                    <p className="inputText">Date</p>
                    <input type="datetime-local" className={getInputClass('date', errors)} value={date} required onChange={(e) => setDate(getFormattedLocalDateTime(e.target.value))} />
                </div>
            </div>
            <div className="buttonContainer">
                <button className="backBtn button" onClick={onBack}>Back</button>
                <button className="saveBtn button" onClick={onSubmit}>Save</button>
                <button className="deleteBtn button" onClick={onDelete}>Delete</button>
            </div>
        </>
    )
}

export default ChangeTransaction