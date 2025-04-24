"use client";
import { useState } from "react";
import styles from "@/app/ui/dashboard/addProduct/addProduct.module.css";

const AddProductPage = () => {
  const [formData, setFormData] = useState({
    title: "",
    cat: "",
    price: "",
    stock: "",
    color: "",
    size: "",
    desc: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const res = await fetch("http://localhost:8000/products", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: formData.title,
          category: formData.cat,
          price: parseFloat(formData.price),
          stock: parseInt(formData.stock),
          color: formData.color,
          size: formData.size,
          desc: formData.desc,
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.detail || "Failed to add product.");
      }

      alert("Product added successfully!");
      setFormData({
        title: "",
        cat: "",
        price: "",
        stock: "",
        color: "",
        size: "",
        desc: "",
      });
    } catch (error: any) {
      alert(`Error: ${error.message}`);
    }
  };

  return (
    <div className={styles.container}>
      <form className={styles.form} onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          required
        />
        <select name="cat" value={formData.cat} onChange={handleChange} required>
          <option value="">Choose a Category</option>
          <option value="kitchen">Kitchen</option>
          <option value="phone">Phone</option>
          <option value="computer">Computer</option>
        </select>
        <input
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          placeholder="Price"
          name="price"
          value={formData.price}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          placeholder="Stock"
          name="stock"
          value={formData.stock}
          onChange={handleChange}
          required
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
          name="desc"
          placeholder="Description"
          value={formData.desc}
          onChange={handleChange}
          rows={6}
        ></textarea>
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default AddProductPage;
