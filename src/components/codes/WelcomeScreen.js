import { Link } from "react-router-dom"
import styles from "../styles/WelcomeScreen.module.scss"

const WelcomeScreen = () => {
    return (
        <div className={styles.content}>
            <h1 className={styles.title}>Welcome to the Wallet App</h1>
            <h3 className={styles.description}>Track expenses, income, transfers, multiple accounts and currencies — all in one simple web app.</h3>
            <p className={styles.note}>No sign-up. Your data stays in your browser.</p>
            <Link to="addAccount">
                <button className={styles.button}>Create Your First Account</button>
            </Link>
        </div>
    )
}

export default WelcomeScreen