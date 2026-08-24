import { Link } from "react-router-dom";
import styles from "../styles/ViewAllTransactions.module.scss";
import cn from "classnames";
import { useTranslation } from "react-i18next";

const ViewAllTransactions = () => {
  const { t } = useTranslation();
  return (
    <Link to="transactions">
      <div className={styles.viewBox}>
        <div className={cn(styles.viewAll, "button")}>
          <p>{t("transaction.viewAll")}</p>
        </div>
      </div>
    </Link>
  );
};

export default ViewAllTransactions;
