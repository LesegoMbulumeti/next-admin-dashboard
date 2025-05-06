"use client";

import styles from "@/app/ui/dashboard/addProduct/singleProduct/singleProduct.module.css";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

const SingleProductPage = () => {
  const { id } = useParams();
  const [formData, setFormData] = useState({
    title: "",
    price: "",
    stock: "",
    color: "",
    size: "",
    category: "",
    desc: "",
  });

  // Fetch product on page load
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(`http://localhost:8000/products/${id}`);
        if (!res.ok) throw new Error("Failed to fetch product");
        const data = await res.json();

        setFormData({
          title: data.title || "",
          price: data.price?.toString() || "",
          stock: data.stock?.toString() || "",
          color: data.color || "",
          size: data.size || "",
          category: data.category || "",
          desc: data.desc || "",
        });
      } catch (err) {
        console.error("Fetch error:", err);
      }
    };

    if (id) fetchProduct();
  }, [id]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const res = await fetch(`http://localhost:8000/products/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: formData.title,
          price: parseFloat(formData.price),
          stock: parseInt(formData.stock),
          color: formData.color,
          size: formData.size,
          category: formData.category,
          desc: formData.desc,
        }),
      });

      if (!res.ok) throw new Error("Failed to update product");

      alert("Product updated successfully!");
    } catch (err: any) {
      alert(`Update failed: ${err.message}`);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.infoContainer}>
        <div className={styles.imgContainer}>
          <Image src={"/icons8-avatar.png"} alt="" fill />
        </div>
        {formData.title}
      </div>
      <div className={styles.formContainer}>
        <form className={styles.form} onSubmit={handleUpdate}>
          <label>Title</label>
          <input type="text" name="title" value={formData.title} onChange={handleChange} />

          <label>Price</label>
          <input type="number" name="price" value={formData.price} onChange={handleChange} />

          <label>Stock</label>
          <input type="number" name="stock" value={formData.stock} onChange={handleChange} />

          <label>Color</label>
          <input type="text" name="color" value={formData.color} onChange={handleChange} />

          <label>Size</label>
          <input type="text" name="size" value={formData.size} onChange={handleChange} />

          <label>Cat</label>
          <select name="cat" value={formData.category} onChange={handleChange}>
            <option value="kitchen">Kitchen</option>
            <option value="phone">Phone</option>
            <option value="computer">Computer</option>
          </select>

          <label>Description</label>
          <textarea
            name="desc"
            rows={10}
            placeholder="Description"
            value={formData.desc}
            onChange={handleChange}
          ></textarea>

          <button type="submit">Update</button>
        </form>
      </div>
    </div>
  );
};

export default SingleProductPage;
