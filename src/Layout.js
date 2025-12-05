import { Outlet } from "react-router-dom";
import ThemeSwitch from './components/codes/ThemeSwitch'
import ExportData from './components/codes/ExportData'
import ImportData from "./components/codes/ImportData";

export default function Layout({ toggleTheme, theme, exportData, importData }) {
  return (
    <>
      <header className="header">
        <div className="importExport">
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
