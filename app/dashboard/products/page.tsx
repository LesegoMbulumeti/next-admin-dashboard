"use client";
import { useEffect, useState } from "react";
import styles from "@/app/ui/dashboard/product/product.module.css";
import Pagination from "@/app/ui/dashboard/pagination/pagination";
import Search from "../../ui/dashboard/search/search";
import Link from "next/link";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface Product {
  prod_id: string;
  title: string;
  description: string;
  price: number;
  created_at: string;
  stock: number;
  img?: string;
  category_id: number;
  color?: string;
  size?: string;
}

const ProductsPage = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [productToDelete, setProductToDelete] = useState<string | null>(null);
  const searchParams = useSearchParams();
  const searchTerm = searchParams.get("q") || "";

  const fetchProducts = async () => {
    try {
      const url = searchTerm
        ? `http://localhost:8000/products?q=${searchTerm}`
        : "http://localhost:8000/products";
      
      const res = await fetch(url);
      const data = await res.json();
      setProducts(data);
    } catch (error) {
      console.error("Failed to fetch products:", error);
      setError("Failed to load products");
      toast.error("Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [searchTerm]);

  const openDeleteModal = (prodId: string) => {
    setProductToDelete(prodId);
    setShowDeleteModal(true);
  };

  const closeDeleteModal = () => {
    setShowDeleteModal(false);
    setProductToDelete(null);
  };

  const handleDelete = async () => {
    if (!productToDelete) return;
  
    try {
      const response = await fetch(
        `http://localhost:8000/products/${productToDelete}`,
        {
          method: "DELETE",
        }
      );
  
      if (!response.ok) {
        throw new Error("Failed to delete product");
      }
  
      // Show success toast first
      toast.success("Product deleted successfully!", {
        position: "top-right",
        autoClose: 3000,
      });
  
      // Then update the UI and close modal
      setProducts(products.filter((product) => product.prod_id !== productToDelete));
      
      // Close modal after a slight delay to allow toast to appear
      setTimeout(() => {
        closeDeleteModal();
      }, 100);
  
    } catch (error: any) {
      console.error("Error:", error);
      setError(error.message);
      toast.error(error.message || "Failed to delete product");
      closeDeleteModal();
    }
  };
 
  if (error) return <div className={styles.error}>Error: {error}</div>;

  return (
    <div className={styles.container}>
      <ToastContainer position="top-right" autoClose={3000} />
      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <h3>Confirm Deletion</h3>
            <p>Are you sure you want to delete this product?</p>
            <div className={styles.modalActions}>
              <button
                className={styles.cancelButton}
                onClick={closeDeleteModal}
              >
                Cancel
              </button>
              <button
                className={styles.deleteButton}
                onClick={handleDelete}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      <div className={styles.top}>
        <Search placeholder="Search for a product..." />
        <Link href="/dashboard/products/add">
          <button className={styles.addButton}>Add New</button>
        </Link>
      </div>
      <table className={styles.table}>
        <thead>
          <tr>
            <td>Title</td>
            <td>Description</td>
            <td>Price</td>
            <td>Created At</td>
            <td>Stock</td>
            <td>Actions</td>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product.prod_id}>
              <td>
                <div className={styles.product}>
                  <Image
                    src={product.img || "/icons8-shopping-bag-64.png"}
                    alt={""}
                    width={40}
                    height={40}
                    className={styles.productImage}
                    priority={false}
                  />
                  {product.title}
                </div>
              </td>
              <td>{product.description}</td>
              <td>R{product.price.toFixed(2)}</td>
              <td>{new Date(product.created_at).toLocaleDateString()}</td>
              <td>{product.stock}</td>
              <td>
                <div className={styles.buttons}>
                  <Link href={`/dashboard/products/view/${product.prod_id}`}>
                    <button className={`${styles.button} ${styles.view}`}>
                      View
                    </button>
                  </Link>
                  <button
                    className={`${styles.button} ${styles.delete}`}
                    onClick={() => openDeleteModal(product.prod_id)}
                  >
                    Delete
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <Pagination />
    </div>
  );
};

export default ProductsPage;