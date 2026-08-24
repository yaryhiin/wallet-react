import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import {
  limitToDecimals,
  getFormattedLocalDateTime,
  fetchRate,
} from "../../utils";
import styles from "../styles/FormLayout.module.scss";
import cn from "classnames";
import { useTranslation } from "react-i18next";

const Transfer = ({ transfer, accounts }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  function home() {
    navigate("/");
  }

  const formattedDate = getFormattedLocalDateTime(new Date());

  const [transaction, setTransaction] = useState(getInitialTransaction);

  function getInitialTransaction() {
    const savedTransaction = localStorage.getItem("transfer");
    if (savedTransaction) {
      return JSON.parse(savedTransaction);
    } else {
      localStorage.removeItem("transfer");
      return {
        amount: "",
        exchangeRate: "",
        from: "",
        to: "",
        date: formattedDate,
        isFlipped: false,
      };
    }
  }

  const [errors, setErrors] = useState({});

  const [fromCurrency, setFromCurrency] = useState("");
  const [toCurrency, setToCurrency] = useState("");

  useEffect(() => {
    const fromAcc = accounts.find(
      (account) => String(account.id) === String(transaction.from),
    );
    const toAcc = accounts.find(
      (account) => String(account.id) === String(transaction.to),
    );

    setFromCurrency(fromAcc ? fromAcc.currency : null);
    setToCurrency(toAcc ? toAcc.currency : null);
  }, [transaction.from, transaction.to, accounts]);

  useEffect(() => {
    if (accounts.length < 2) return;

    setTransaction((prev) => ({
      ...prev,
      from: accounts[0].id,
      to: accounts[1].id,
    }));
  }, [accounts]);

  useEffect(() => {
    if (transaction)
      localStorage.setItem("transfer", JSON.stringify(transaction));
  }, [transaction]);

  useEffect(() => {
    async function loadRate() {
      if (!fromCurrency || !toCurrency) return;

      const fetchedRate = await fetchRate(fromCurrency, toCurrency);

      if (fetchedRate !== null && !transaction.exchangeRate) {
        setTransaction((prev) => ({
          ...prev,
          exchangeRate: limitToDecimals(fetchedRate, 4),
        }));
      }
    }

    loadRate();
  }, [fromCurrency, toCurrency]);

  useEffect(() => {
    const fromAcc = accounts.find((account) => account.id === transaction.from);
    const toAcc = accounts.find((account) => account.id === transaction.to);
    setFromCurrency(fromAcc ? fromAcc.currency : null);
    setToCurrency(toAcc ? toAcc.currency : null);
  }, [transaction.from, transaction.to, accounts]);

  if (accounts.length < 2) {
    return <p>{t("transaction.loading")}</p>;
  }

  function handleSwapCurrencies() {
    const oldFrom = fromCurrency;
    const oldTo = toCurrency;

    setFromCurrency(oldTo);
    setToCurrency(oldFrom);
  }

  const onSubmit = async (e) => {
    e.preventDefault();

    const newErrors = {};
    const numericAmount =
      transaction.amount === "" ? 0 : Number(transaction.amount);
    const numericRate =
      transaction.exchangeRate === "" ? 0 : Number(transaction.exchangeRate);
    if (!numericAmount || numericAmount <= 0) newErrors.amount = true;
    if (!numericRate) newErrors.exchangeRate = true;
    if (!transaction.from) newErrors.from = true;
    if (!transaction.to) newErrors.to = true;
    if (!transaction.date) newErrors.date = true;
    if (transaction.from === transaction.to) {
      newErrors.to = true;
      newErrors.from = true;
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const adjustedExchangeRate = transaction.isFlipped
      ? 1 / numericRate
      : numericRate;

    await transfer(
      transaction.from,
      transaction.to,
      numericAmount,
      transaction.date,
      adjustedExchangeRate,
    );

    home();
    localStorage.removeItem("transfer");
  };

  const onBack = (e) => {
    e.preventDefault();

    home();
    localStorage.removeItem("transfer");
  };

  return (
    <div className={styles.formContainer}>
      <div className={styles.inputBox}>
        <div className={styles.inputContainer}>
          <p className={styles.inputText}>{t("transaction.amount.title")}</p>
          <input
            className={cn(styles.input, errors.amount && styles.error)}
            value={transaction.amount === 0 ? "" : transaction.amount}
            placeholder={t("transaction.amount.placeHolder")}
            type="number"
            required
            onChange={(e) => {
              setTransaction((prev) => ({ ...prev, amount: e.target.value }));
            }}
          />
        </div>

        <div className={styles.inputContainer}>
          <p className={styles.inputText}>{t("transaction.from")}</p>
          <select
            className={cn(styles.input, errors.from && styles.error)}
            value={transaction.from}
            required
            onChange={(e) =>
              setTransaction((prev) => ({ ...prev, from: e.target.value }))
            }
          >
            {accounts.map((account) => (
              <option key={account.id} value={account.id}>
                {account.name}
              </option>
            ))}
          </select>
        </div>

        <div className={styles.inputContainer}>
          <p className={styles.inputText}>{t("transaction.to")}</p>
          <select
            className={cn(styles.input, errors.to && styles.error)}
            value={transaction.to}
            required
            onChange={(e) =>
              setTransaction((prev) => ({ ...prev, to: e.target.value }))
            }
          >
            {accounts.map((account) => (
              <option key={account.id} value={account.id}>
                {account.name}
              </option>
            ))}
          </select>
        </div>

        <div className={styles.inputContainer}>
          <p className={styles.inputText}>{t("transaction.rate.title")}</p>
          <div className={styles.fieldRow}>
            1 {fromCurrency} =
            <input
              className={cn(styles.input, errors.exchangeRate && styles.error)}
              value={
                transaction.exchangeRate === 0 ? "" : transaction.exchangeRate
              }
              placeholder={t("transaction.rate.placeHolder")}
              type="number"
              required
              onChange={(e) => {
                setTransaction((prev) => ({
                  ...prev,
                  exchangeRate: e.target.value,
                }));
              }}
            />{" "}
            {toCurrency}
            <button
              className={cn(styles.convertBtn, "button")}
              onClick={() => {
                setTransaction((prev) => ({
                  ...prev,
                  isFlipped: !prev.isFlipped,
                }));
                handleSwapCurrencies();
              }}
            >
              🔄
            </button>
          </div>
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
      </div>
    </div>
  );
};

export default Transfer;
