import Image from "next/image";
import styles from "./transactions.module.css";

const Transactions = () => {
  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Latest Transactions</h2>
      <table className={styles.table}>
        <thead>
          <tr>
            <td>Name</td>
            <td>Status</td>
            <td>Date</td>
            <td>Amount</td>
          </tr>
        </thead>
        
          <tbody>
            <tr>
              <td>
              <div className={styles.user}>
                <Image
                  src="/face-7993.png"
                  alt=""
                  width={40}
                  height={40}
                  className={styles.userImage}
                />
                Neymar Junior
                </div>
              </td>
              <td>
                <span className={`${styles.status} ${styles.pending}`}>
                  Pending
                </span>
              </td>
              <td>14.02.2024</td>
              <td>R30,000</td>
            </tr>
         
            <tr>
              <td>
                <div className={styles.user}>
                <Image
                  src="/face-7993.png"
                  alt=""
                  width={40}
                  height={40}
                  className={styles.userImage}
                />
                Neymar Junior
                </div>
              </td>
              <td>
                <span className={`${styles.status} ${styles.done}`}>
                  Done
                </span>
              </td>
              <td>14.02.2024</td>
              <td>R30,000</td>
            </tr>
            <tr>
              <td>
              <div className={styles.user}>
                <Image
                  src="/face-7993.png"
                  alt=""
                  width={40}
                  height={40}
                  className={styles.userImage}
                />
                Neymar Junior
                </div>
              </td>
              <td>
                <span className={`${styles.status} ${styles.cancelled}`}>
                  Cancelled
                </span>
              </td>
              <td>14.02.2024</td>
              <td>R30,000</td>
            </tr>
          </tbody>

        
      </table>
    </div>
  );
};

export default Transactions;
