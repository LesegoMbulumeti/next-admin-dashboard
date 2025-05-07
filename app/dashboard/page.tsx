import styles from '../ui/dashboard/dashboard.module.css';
import Cards from '../ui/dashboard/cards/cards';
import Transaction from '../ui/dashboard/transactions/transaction';
import Chart from '../ui/dashboard/chart/chart';

const Dashboard = () => {
    return (
    <div className={styles.wrapper}>
        <div className={styles.main}>
            <Cards />
            <Transaction/>
            <Chart/>
        </div>
    </div>
    )
}

export default Dashboard;