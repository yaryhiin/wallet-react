import styles from '../styles/ThemeSwitch.module.scss'

const ThemeSwitch = ({toggleTheme, theme}) => {
    return (
        <div>
            <button
                type="button"
                onClick={toggleTheme}
                className={styles.themeSwitch}
                aria-pressed={theme === 'dark'}
                title={theme === 'dark' ? 'Switch to light' : 'Switch to dark'}
            >
                {theme === 'dark' ? '🌙 Dark' : '☀️ Light'}
            </button>
        </div>
    )
}

export default ThemeSwitch