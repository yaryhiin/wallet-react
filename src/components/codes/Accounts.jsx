import styles from "../styles/Accounts.module.scss";
import Account from "./Account";
import AddAccountBtn from "./AddAccountBtn";
import { useTranslation } from "react-i18next";

const Accounts = ({ accounts }) => {
  const { t } = useTranslation();

  const totalsByCurrency = accounts.reduce((acc, account) => {
    const currency = account.currency;
    const balance = Number(account.balance) || 0;

    acc[currency] = (acc[currency] || 0) + balance;

    return acc;
  }, {});
  return (
    <div className={styles.container}>
      <div className={styles.title}>
        <h1 className="title">{t("account.accounts")}</h1>
        <div className={styles.totalBalance}>
          <p>{t("account.totalBal")}</p>
          {Object.entries(totalsByCurrency).map(([currency, total]) => (
            <p key={currency}>
              {total} {currency}
            </p>
          ))}
        </div>
      </div>
      <div className={styles.accounts}>
        {accounts.map((account) => (
          <Account key={account.id} account={account} />
        ))}
        {accounts.length < 4 && <AddAccountBtn />}
      </div>
      {accounts.length === 4 && (
        <p className={styles.limitText}>{t("account.accLimit")}</p>
      )}
    </div>
  );
};

export default Accounts;
