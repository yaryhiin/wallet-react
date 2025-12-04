import { Outlet } from "react-router-dom";
import ThemeSwitch from './components/codes/ThemeSwitch'
import ExportData from './components/codes/ExportData'

export default function Layout({ toggleTheme, theme, exportData }) {
  return (
    <>
      <ThemeSwitch toggleTheme={toggleTheme} theme={theme} />
      <ExportData exportData={exportData} />

      {/* This is where the current page goes */}
      <Outlet />
    </>
  );
}
