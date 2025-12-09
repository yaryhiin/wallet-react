import { Outlet } from "react-router-dom";
import ThemeSwitch from './components/codes/ThemeSwitch'
import ExportData from './components/codes/ExportData'
import ImportData from "./components/codes/ImportData";
import styles from './components/styles/Header.module.scss'

export default function Layout({ toggleTheme, theme, exportData, importData }) {
  return (
    <>
      <header className="header">
        <div className={styles.importExport}>
          <ImportData importData={importData} />
          <ExportData exportData={exportData} />
        </div>
        <ThemeSwitch toggleTheme={toggleTheme} theme={theme} />
      </header>
      <main className="body">
        <Outlet />
      </main>
    </>
  );
}
