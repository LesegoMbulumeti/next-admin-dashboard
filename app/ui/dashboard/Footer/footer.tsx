import styles from './footer.module.css';

const footer = () => {
    return (
        <div className={styles.container}> 
            <div className={styles.logo}>Lesego Dev</div>
            <div className={styles.text}>© 2025 All rights reserved</div>
        </div>
    );
};

export default footer;