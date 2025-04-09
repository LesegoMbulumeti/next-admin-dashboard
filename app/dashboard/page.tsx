import styles from '../ui/dashboard/dashboard.module.css';
import Card from '../ui/dashboard/card/card';
import Transaction from '../ui/dashboard/transactions/transaction';
import Chart from '../ui/dashboard/chart/chart';
//import Rightbar from '../ui/dashboard/rightbar/rightbar';

const dashboard = () => {
    return (
    <div className={styles.wrapper}>
        <div className={styles.main}>
        <div className={styles.cards}>
            <Card/>
            <Card/>
            <Card/>
            </div>
            <Transaction/>
            <Chart/>
        </div>
       
    </div>
    )


}

export default dashboard;