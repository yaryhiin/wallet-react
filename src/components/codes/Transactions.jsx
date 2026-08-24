import styles from "../styles/Transactions.module.scss";
import { useNavigate } from "react-router-dom";
import { formatDate } from "../../utils";
import { useState } from "react";
import { useTranslation } from "react-i18next";

const Transactions = ({ transactions, accounts }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  function home() {
    navigate("/");
  }
  const [sortConfig, setSortConfig] = useState({
    key: "date",
    direction: "desc",
  });
  const arrow = sortConfig.direction === "asc" ? "▴" : "▾";
  const sortedTransactions = [...transactions].sort((a, b) => {
    const { key, direction } = sortConfig;
    let aValue = a[key];
    let bValue = b[key];

    if (key === "date") {
      aValue = new Date(a.date);
      bValue = new Date(b.date);
    } else if (key === "amount") {
      aValue = Number(a.amount);
      bValue = Number(b.amount);
    } else if (key === "account") {
      aValue =
        accounts.find((acc) => String(acc.id) === String(a.account_id))?.name ||
        "";
      bValue =
        accounts.find((acc) => String(acc.id) === String(b.account_id))?.name ||
        "";
    }

    if (aValue > bValue) return direction === "asc" ? 1 : -1;
    if (aValue < bValue) return direction === "asc" ? -1 : 1;

    return 0;
  });

  function handleSort(key) {
    setSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === "asc" ? "desc" : "asc",
    }));
  }

  return (
    <div className={styles.allTransactionsBox}>
      <h1 className="title">{t("transaction.all")}</h1>
      <div className={styles.tableWrapper}>
        <table>
          <thead>
            <tr>
              <th onClick={() => handleSort("category")}>
                {t("transaction.category")}
                {sortConfig.key === "category" && arrow}
              </th>
              <th onClick={() => handleSort("amount")}>
                {t("transaction.amount.title")}
                {sortConfig.key === "amount" && arrow}
              </th>
              <th onClick={() => handleSort("currency")}>
                {t("transaction.cur")}
                {sortConfig.key === "currency" && arrow}
              </th>
              <th onClick={() => handleSort("account")}>
                {t("transaction.method")}
                {sortConfig.key === "account" && arrow}
              </th>
              <th onClick={() => handleSort("date")}>
                {t("transaction.date")}
                {sortConfig.key === "date" && arrow}
              </th>
            </tr>
          </thead>

          <tbody>
            {sortedTransactions.map((transaction) => (
              <tr
                key={transaction.id}
                className={styles.transactionRow}
                onClick={() =>
                  navigate(`/changeTransaction/${transaction.id}`, {
                    state: { from: "/transactions" },
                  })
                }
              >
                <td className={styles.transCategory}>{transaction.category}</td>
                {transaction.type === "income" ? (
                  <td className={styles.transAmountIncome}>
                    {transaction.amount}
                  </td>
                ) : (
                  <td className={styles.transAmountExpense}>
                    -{transaction.amount}
                  </td>
                )}
                <td className={styles.transCurrency}>{transaction.currency}</td>
                <td>
                  {accounts.find(
                    (account) =>
                      String(account.id) === String(transaction.account_id),
                  )?.name || "Unknown Account"}
                </td>
                <td>{formatDate(transaction.date)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="buttonContainer">
        <button
          className="backBtn button"
          onClick={(e) => {
            e.preventDefault();
            home();
          }}
        >
          {t("common.back")}
        </button>
      </div>
    </div>
  );
};

export default Transactions;
