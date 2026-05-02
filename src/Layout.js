import { Outlet } from "react-router-dom";
import ThemeSwitch from './components/codes/ThemeSwitch'
import styles from './components/styles/Header.module.scss'
import cn from 'classnames'

export default function Layout({ toggleTheme, theme }) {
  return (
    <>
      <header className="header">
            <a href="/" className={cn("button", styles.logOut)}>Log Out</a>
        <ThemeSwitch toggleTheme={toggleTheme} theme={theme} />
      </header>
      <main className="body">
        <div className="container">
          <Outlet />
        </div>
      </main>
    </>
  );
}
