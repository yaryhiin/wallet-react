import ThemeSwitch from './components/codes/ThemeSwitch'
import styles from './components/styles/Header.module.scss'
import cn from 'classnames'
import { supabase } from './supabase'
import { useNavigate, Outlet } from 'react-router-dom';

export default function Layout({ children, toggleTheme, theme }) {
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
        <button className={cn("button", styles.logOut)} onClick={handleLogout}>Log Out</button>
        <ThemeSwitch toggleTheme={toggleTheme} theme={theme} />
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
