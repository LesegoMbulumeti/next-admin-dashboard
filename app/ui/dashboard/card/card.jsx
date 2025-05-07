import styles from "./card.module.css";
import { useState, useEffect } from "react";

const Card = ({ icon, title, fetchData, formatValue, compareWithPrevious = true }) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [percentChange, setPercentChange] = useState(0);

  useEffect(() => {
    const getData = async () => {
      try {
        setLoading(true);
        const result = await fetchData();
        setData(result.current);
        
        // Calculate percent change if we have previous data
        if (compareWithPrevious && result.previous !== undefined) {
          const current = result.current || 0;
          const previous = result.previous || 0;
          
          // Avoid division by zero
          if (previous === 0) {
            setPercentChange(current > 0 ? 100 : 0);
          } else {
            const change = ((current - previous) / previous) * 100;
            setPercentChange(change);
          }
        }
        
        setLoading(false);
      } catch (err) {
        console.error("Error fetching data for card:", err);
        setError("Failed to load data");
        setLoading(false);
      }
    };

    getData();
  }, [fetchData, compareWithPrevious]);

  return (
    <div className={styles.container}>
      {icon}
      <div className={styles.texts}>
        <span className={styles.title}>{title}</span>
        {loading ? (
          <span className={styles.number}>Loading...</span>
        ) : error ? (
          <span className={styles.error}>{error}</span>
        ) : (
          <>
            <span className={styles.number}>{formatValue(data)}</span>
            {compareWithPrevious && (
              <span className={styles.detail}>
                <span className={percentChange >= 0 ? styles.positive : styles.negative}>
                  {percentChange >= 0 ? "+" : ""}{percentChange.toFixed(1)}%
                </span>{" "}
                compared to previous week
              </span>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Card;