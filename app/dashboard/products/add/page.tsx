"use client";
import { useState } from "react";
import styles from "@/app/ui/dashboard/addProduct/addProduct.module.css";
import { useRouter } from "next/navigation";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AddProductPage = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    title: "",
    category_id: "",
    price: "",
    stock: "",
    color: "",
    size: "",
    description: "",
    img: "",
  });

  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        name === "price" || name === "stock" || name === "category_id"
          ? Number(value)
          : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      // Convert numeric fields
      const numericData = {
        ...formData,
        price: parseFloat(formData.price),
        stock: parseInt(formData.stock),
        category_id: parseInt(formData.category_id),
      };

      const response = await fetch("http://localhost:8000/products", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(numericData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.detail ||
            errorData.message ||
            `Failed to add product (status ${response.status})`
        );
      }

      // Show success toast
      toast.success("Product added successfully!", {
        position: "top-right",
        autoClose: 3000,
        onClose: () => router.push("/dashboard/products"),
      });

      // Reset form
      setFormData({
        title: "",
        category_id: "",
        price: "",
        stock: "",
        color: "",
        size: "",
        description: "",
        img: "",
      });
    } catch (error: any) {
      console.error("Error adding product:", error);
      setError(error.message);
      toast.error(error.message || "Failed to add product");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={styles.container}>
      <ToastContainer />
      {error && <div className={styles.error}>{error}</div>}
      <form className={styles.form} onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          required
        />
        <select
          name="category_id"
          value={formData.category_id}
          onChange={handleChange}
        >
          <option value="">Choose a Category</option>
          <option value="1">Electronics</option>
          <option value="2">Clothing</option>
          <option value="3">Home</option>
          <option value="4">Other</option>
        </select>
        <input
          type="number"
          placeholder="Price"
          name="price"
          value={formData.price}
          onChange={handleChange}
          min="0"
          step="0.01"
          required
        />
        <input
          type="number"
          placeholder="Stock"
          name="stock"
          value={formData.stock}
          onChange={handleChange}
          min="0"
          required
        />
        <input
          type="text"
          placeholder="Image URL"
          name="img"
          onChange={handleChange}
        />
        <input
          type="text"
          placeholder="Color"
          name="color"
          value={formData.color}
          onChange={handleChange}
        />
        <input
          type="text"
          placeholder="Size"
          name="size"
          value={formData.size}
          onChange={handleChange}
        />
        <textarea
          name="description"
          placeholder="Description"
          value={formData.description}
          onChange={handleChange}
          rows={6}
          required
        />
        <div className={styles.buttonContainer}>
          <button
            type="button"
            onClick={() => router.push("/dashboard/products")}
            className={styles.cancelButton}
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={isSubmitting}
            className={styles.submitButton}
          >
            {isSubmitting ? "Adding..." : "Add Product"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddProductPage;
