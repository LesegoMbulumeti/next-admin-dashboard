"use client";

import { MdSupervisedUserCircle, MdShoppingBag, MdAttachMoney } from "react-icons/md";
import Card from "../card/card";
import styles from "./cards.module.css";
import { fetchUsers, fetchProducts, fetchTotalProductValue } from "@/app/lib/data";

const Cards = () => {
  // Format functions for different card types
  const formatNumber = (value) => value?.toLocaleString() || "0";
  const formatCurrency = (value) => `R${value?.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) || "0.00"}`;

  return (
    <div className={styles.container}>
      <Card
        icon={<MdSupervisedUserCircle size={24} />}
        title="Total Users"
        fetchData={fetchUsers}
        formatValue={formatNumber}
      />
      <Card
        icon={<MdShoppingBag size={24} />}
        title="Total Products"
        fetchData={fetchProducts}
        formatValue={formatNumber}
      />
      <Card
        icon={<MdAttachMoney size={24} />}
        title="Total Product Value"
        fetchData={fetchTotalProductValue}
        formatValue={formatCurrency}
      />
    </div>
  );
};

export default Cards;