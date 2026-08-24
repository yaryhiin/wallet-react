import ThemeSwitch from "./components/codes/ThemeSwitch";
import styles from "./components/styles/Header.module.scss";
import cn from "classnames";
import { supabase } from "./supabase";
import { useNavigate, Outlet } from "react-router-dom";
import { useTranslation } from "react-i18next";

export default function Layout({
  children,
  toggleTheme,
  theme,
  language,
  setLanguage,
}) {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();

    if (error) {
      console.error("Logout error:", error.message);
      return;
    }

    navigate("/");
  };
  return (
    <>
      <header className="header">
        <button className={cn("button", styles.logOut)} onClick={handleLogout}>
          {t("auth.logout")}
        </button>
        <div>
          <ThemeSwitch toggleTheme={toggleTheme} theme={theme} />

          <select
            value={language}
            onChange={(e) => {
              i18n.changeLanguage(e.target.value);
              setLanguage(e.target.value);
            }}
          >
            <option value="en">English</option>
            <option value="pl">Polska</option>
          </select>
        </div>
      </header>
      <main className="body">
        <div className="container">
          {children}
          <Outlet />
        </div>
      </main>
    </>
  );
}
