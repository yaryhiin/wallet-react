import { Link } from 'react-router-dom'
import styles from '../styles/Accounts.module.scss'
import cn from 'classnames';

const AddAccountBtn = () => {
    return (
        <Link to="addAccount">
            <div className={cn(styles.accountStyle, styles.addAccBtn, "button")}>
                <img src={`${process.env.PUBLIC_URL}/images/buttons/add_btn.png`} alt="Add Account" />
            </div>
        </Link>
    )
}

export default AddAccountBtn