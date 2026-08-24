import { useNavigate, useParams, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { getFormattedLocalDateTime } from "../../utils";
import Modal from "./Modal";
import MessageModal from "./MessageModal";
import styles from "../styles/FormLayout.module.scss";
import cn from "classnames";
import { useTranslation } from "react-i18next";

const ChangeTransaction = ({
  accounts,
  transactions,
  changeTransaction,
  deleteTransaction,
  addCategory,
  categories,
  deleteCategory,
}) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from || "/";
  function home() {
    navigate(from);
  }

  const [transaction, setTransaction] = useState();

  const [errors, setErrors] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [showMessageModal, setShowMessageModal] = useState(false);

  async function handleAddCategory(newCategory) {
    const updatedCategory = await addCategory({
      type: transaction.type,
      name: newCategory,
    });
    if (!updatedCategory) return;
    setOptions((prev) => [...prev, updatedCategory]);
    setTransaction((prev) => ({ ...prev, category: newCategory }));
    setShowModal(false);
  }

  const { id } = useParams();

  useEffect(() => {
    if (!transactions) return;
    const savedTransaction = localStorage.getItem("transaction");
    if (savedTransaction) {
      setTransaction(JSON.parse(savedTransaction));
    } else {
      localStorage.removeItem("transaction");
      setTransaction(
        transactions.find((t) => String(t.id) === String(id)) ?? {
          type: "",
          amount: "",
          category: "",
          accountId: 0,
          date: "",
        },
      );
    }
  }, [transactions, id]);

  const [options, setOptions] = useState([]);

  useEffect(() => {
    if (transaction)
      localStorage.setItem("transaction", JSON.stringify(transaction));
  }, [transaction]);

  useEffect(() => {
    if (transaction?.type)
      setOptions(categories.filter((c) => c.type === transaction.type));
  }, [transaction?.type, categories]);

  if (!transaction) {
    return <p>{t("transaction.loading")}</p>;
  }

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
    const numericAmount =
      transaction.amount === "" ? 0 : Number(transaction.amount);
    if (!numericAmount || numericAmount <= 0 || numericAmount > 999999999)
      newErrors.amount = true;
    if (!transaction.category) newErrors.category = true;
    if (!transaction.accountId) newErrors.accountId = true;
    if (!transaction.date) newErrors.date = true;

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    await changeTransaction({
      id,
      category: transaction.category,
      amount: numericAmount,
      currency,
      type: transaction.type,
      account_id: transaction.accountId,
      date: transaction.date,
    });

    home();
    localStorage.removeItem("transaction");
  };

  const onBack = (e) => {
    e.preventDefault();

    home();
    localStorage.removeItem("transaction");
  };

  const onDelete = async (e) => {
    e.preventDefault();

    setTransaction({
      type: "",
      amount: "",
      category: "",
      accountId: 0,
      date: "",
    });

    await deleteTransaction(id);

    home();
  };

  return (
    <div className={styles.formContainer}>
      <h1 className={styles.heading}>{t("transaction.changeTrans")}</h1>
      <div className={styles.inputBox}>
        <div className={styles.inputContainer}>
          <p className={styles.inputText}>{t("transaction.type.title")}</p>
          <select
            className={cn(styles.input)}
            value={transaction.type}
            required
            onChange={(e) =>
              setTransaction((prev) => ({ ...prev, type: e.target.value }))
            }
          >
            <option value="income">{t("transaction.type.income")}</option>
            <option value="expense">{t("transaction.type.expense")}</option>
          </select>
        </div>

        <div className={styles.inputContainer}>
          <p className={styles.inputText}>{t("transaction.amount.title")}</p>
          <input
            className={cn(styles.input, errors.amount && styles.error)}
            value={transaction.amount}
            placeholder={t("transaction.amount.placeHolder")}
            type="number"
            required
            onChange={(e) => {
              setTransaction((prev) => ({ ...prev, amount: e.target.value }));
            }}
          />
        </div>

        <div className={styles.inputContainer}>
          <p className={styles.inputText}>{t("transaction.category")}</p>
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
                setTransaction((prev) => ({
                  ...prev,
                  category: e.target.value,
                }));
              }}
            >
              {options.map((c) => (
                <option key={c.id} value={c.name}>
                  {c.name}
                </option>
              ))}
              <option value="" disabled>
                {t("transaction.selectCategory")}
              </option>
              <option value="__add_new_category__">+ Add new category</option>
            </select>
            <button
              className={cn(
                styles.deleteCategoryBtn,
                styles.deleteBtn,
                "button",
              )}
              onClick={() => setShowMessageModal(true)}
            >
              🗑️
            </button>
          </div>
        </div>
        {showMessageModal && (
          <MessageModal
            title={t("modal.category.title")}
            text={t("modal.category.text")}
            onDelete={handleDeleteCategory}
            onClose={() => setShowMessageModal(false)}
          />
        )}

        {showModal && (
          <Modal
            onAddCategory={handleAddCategory}
            onClose={() => setShowModal(false)}
          />
        )}

        <div className={styles.inputContainer}>
          <p className={styles.inputText}>{t("transaction.method")}</p>
          <select
            className={cn(styles.input, errors.accountId && styles.error)}
            value={transaction.accountId}
            required
            onChange={(e) =>
              setTransaction((prev) => ({ ...prev, accountId: e.target.value }))
            }
          >
            <option value="" disabled>
              {t("transaction.selectMethod")}
            </option>
            {accounts.map((account) => (
              <option key={account.id} value={account.id}>
                {account.name}
              </option>
            ))}
          </select>
        </div>

        <div className={cn(styles.inputContainer, styles.fullWidth)}>
          <p className={styles.inputText}>{t("transaction.date")}</p>
          <input
            type="datetime-local"
            className={cn(styles.input, errors.date && styles.error)}
            value={transaction.date}
            required
            onChange={(e) =>
              setTransaction((prev) => ({
                ...prev,
                date: getFormattedLocalDateTime(e.target.value),
              }))
            }
          />
        </div>
      </div>
      <div className={styles.buttonContainer}>
        <button className="backBtn button" onClick={onBack}>
          {t("common.back")}
        </button>
        <button className={cn(styles.saveBtn, "button")} onClick={onSubmit}>
          {t("common.save")}
        </button>
        <button className={cn(styles.deleteBtn, "button")} onClick={onDelete}>
          {t("common.delete")}
        </button>
      </div>
    </div>
  );
};

export default ChangeTransaction;
