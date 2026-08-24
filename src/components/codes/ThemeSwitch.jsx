import styles from "../styles/Header.module.scss";
import { useTranslation } from "react-i18next";

const ThemeSwitch = ({ toggleTheme, theme }) => {
  const { t } = useTranslation();
  return (
    <div>
      <button
        type="button"
        onClick={toggleTheme}
        className={styles.themeSwitch}
        aria-pressed={theme === "dark"}
        title={theme === "dark" ? "Switch to light" : "Switch to dark"}
      >
        {theme === "dark" ? `🌙 ${t("theme.dark")}` : `☀️ ${t("theme.light")}`}
      </button>
    </div>
  );
};

export default ThemeSwitch;
