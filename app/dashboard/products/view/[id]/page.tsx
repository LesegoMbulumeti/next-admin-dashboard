"use client";

import styles from "@/app/ui/dashboard/product/viewProduct/viewProduct.module.css";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";

interface Product {
  id: number;
  title: string;
  desc: string;
  price: number;
  created_at?: string;
  stock: number;
  img?: string;
  color?: string;
  size?: string;
  category?: string;
}

const ViewProductPage = () => {
  const { id } = useParams();
  const router = useRouter();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  // Fetch product on page load
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(`http://localhost:8000/products/${id}`);
        if (!res.ok) throw new Error("Failed to fetch product");
        const data = await res.json();
        setProduct(data);
      } catch (err) {
        console.error("Fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchProduct();
  }, [id]);

  if (loading) return <div>Loading...</div>;
  if (!product) return <div>Product not found</div>;

  return (
    <div className={styles.container}>
      <div className={styles.infoContainer}>
        <div className={styles.imgContainer}>
          <Image src={product.img || "/icons8-avatar.png"} alt={product.title} fill />
        </div>
        {product.title}
      </div>
      <div className={styles.detailsContainer}>
        <div className={styles.detailItem}>
          <div className={styles.detailTitle}>Title</div>
          <div className={styles.detailValue}>{product.title}</div>
        </div>
        
        <div className={styles.detailItem}>
          <div className={styles.detailTitle}>Description</div>
          <div className={styles.detailValue}>{product.desc}</div>
        </div>
        
        <div className={styles.detailItem}>
          <div className={styles.detailTitle}>Price</div>
          <div className={styles.detailValue}>R {product.price.toFixed(2)}</div>
        </div>
        
        <div className={styles.detailItem}>
          <div className={styles.detailTitle}>Stock</div>
          <div className={styles.detailValue}>{product.stock}</div>
        </div>
        
        {product.color && (
          <div className={styles.detailItem}>
            <div className={styles.detailTitle}>Color</div>
            <div className={styles.detailValue}>{product.color}</div>
          </div>
        )}
        
        {product.size && (
          <div className={styles.detailItem}>
            <div className={styles.detailTitle}>Size</div>
            <div className={styles.detailValue}>{product.size}</div>
          </div>
        )}
        
        {product.category && (
          <div className={styles.detailItem}>
            <div className={styles.detailTitle}>Category</div>
            <div className={styles.detailValue}>{product.category}</div>
          </div>
        )}
        
        {product.created_at && (
          <div className={styles.detailItem}>
            <div className={styles.detailTitle}>Created At</div>
            <div className={styles.detailValue}>
              {new Date(product.created_at).toLocaleDateString()}
            </div>
          </div>
        )}
        
        <Link href="/dashboard/products" className={styles.backButton}>
          Back to Products
        </Link>
      </div>
    </div>
  );
};

export default ViewProductPage;