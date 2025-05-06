"use client";
import { useState, useEffect } from "react";
import styles from "@/app/ui/dashboard/addUser/addUser.module.css";
import { useRouter } from "next/navigation";
import { getCurrentUser } from "aws-amplify/auth";

const AddUserPage = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    phone: "",
    img: "",
    address: "",
    role: "user",
    status: "active",
  });
  const [cognitoSub, setCognitoSub] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Get cognito_sub when component mounts
  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const user = await getCurrentUser();
        setCognitoSub(user.userId); // or user.sub depending on your auth provider
      } catch (err) {
        console.error("Error fetching current user:", err);
        setError("Failed to authenticate user");
      }
    };
    
    fetchCurrentUser();
  }, []);


  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (error) setError(null);
  };

 const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!cognitoSub) {
      setError("User authentication required");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch("http://localhost:8000/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          cognito_sub: cognitoSub // Add the required field
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 422 && data.detail) {
          const errors = Array.isArray(data.detail) 
            ? data.detail.map((err: any) => 
                `${err.loc?.join('.') || 'field'}: ${err.msg}`
              ).join(", ")
            : data.detail;
          throw new Error(errors);
        }
        throw new Error(data.message || "Failed to create user");
      }

      router.push("/dashboard/users");
      
    } catch (err) {
      console.error("Error creating user:", err);
      setError(err instanceof Error ? err.message : "An unknown error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!cognitoSub && !error) {
    return <div className={styles.container}>Loading user data...</div>;
  }

  return (
    <div className={styles.container}>
      {error && <div className={styles.error}>{error}</div>}
      <form className={styles.form} onSubmit={handleSubmit}>
        
        
          <input
            type="text"
            id="username"
            name="username"
            placeholder="Enter username"
            value={formData.username}
            onChange={handleChange}
            required
          />
        
          
          <input
            type="email"
            id="email"
            name="email"
            placeholder="Enter email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        

          
          <input
            type="tel"
            id="phone"
            name="phone"
            placeholder="Enter phone number"
            value={formData.phone}
            onChange={handleChange}
          />
        

        
          <input
            type="url"
            id="img"
            name="img"
            placeholder="Enter image URL"
            value={formData.img}
            onChange={handleChange}
          />
        

        
          <select
            id="role"
            name="role"
            value={formData.role}
            onChange={handleChange}
          >
            <option value="user">User</option>
            <option value="admin">Admin</option>
          </select>
        

        
          <select
            id="status"
            name="status"
            value={formData.status}
            onChange={handleChange}
          >
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        

        
          <textarea
            id="address"
            name="address"
            rows={5}
            placeholder="Enter address"
            value={formData.address}
            onChange={handleChange}
          />
       
        
          <button
            type="button"
            onClick={() => router.push("/dashboard/users")}
            className={styles.cancelButton}
          >
            Cancel
          </button>
          
          <button
            type="submit"
            disabled={isSubmitting}
            className={styles.submitButton}
          >
            {isSubmitting ? "Creating..." : "Create User"}
          </button>
        
      </form>
    </div>
  );
};

export default AddUserPage;