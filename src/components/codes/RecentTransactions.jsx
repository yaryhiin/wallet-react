import styles from "../styles/Transactions.module.scss";
import Transaction from "./Transaction";
import ViewAllTransactions from "./ViewAllTransactions";
import { useTranslation } from "react-i18next";

const RecentTransactions = ({ transactions, accounts }) => {
  const { t } = useTranslation();
  const sortedTransactions = [...transactions].sort(
    (a, b) => new Date(b.date) - new Date(a.date),
  );
  return (
    <div className={styles.transactionsBox}>
      <h1 className="title">{t("transaction.recent")}</h1>
      {transactions.length === 0 && (
        <div className={styles.noTransactionsContainer}>
          <h3 className={styles.header}>{t("transaction.emptyState.title")}</h3>
          <p className={styles.text}>{t("transaction.emptyState.text")}</p>
        </div>
      )}
      {sortedTransactions.slice(0, 3).map((t) => (
        <Transaction key={t.id} transaction={t} accounts={accounts} />
      ))}
      {transactions.length > 3 && <ViewAllTransactions />}
    </div>
  );
};

export default RecentTransactions;
