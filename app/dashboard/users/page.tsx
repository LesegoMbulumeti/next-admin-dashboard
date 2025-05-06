"use client";
import styles from "@/app/ui/dashboard/users/users.module.css";
import Search from "../../ui/dashboard/search/search";
import Link from "next/link";
import Image from "next/image";
import Pagination from "../../ui/dashboard/pagination/pagination";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { getCurrentUser } from "aws-amplify/auth";

interface User {
  user_id: string;
  username: string;
  email: string;
  role: string;
  status: string;
  cognito_sub: string;
  created_at: string;
}

const UsersPage = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentUserSub, setCurrentUserSub] = useState<string | null>(null);
  const searchParams = useSearchParams();
  const searchTerm = searchParams.get('q') || '';
  const router = useRouter();

  // Get current user's cognito_sub
  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const user = await getCurrentUser();
        setCurrentUserSub(user.userId);
        fetchUsers();
      } catch (err) {
        console.error("Error fetching current user:", err);
        setError("Authentication required");
        setLoading(false);
      }
    };
    fetchCurrentUser();
  }, []);

  const fetchUsers = async () => {
    try {
      const url = searchTerm 
        ? `http://localhost:8000/users?q=${searchTerm}`
        : 'http://localhost:8000/users';
      
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error("Failed to fetch users");
      }
      const data = await response.json();
      setUsers(data);
    } catch (err) {
      console.error("Error fetching users:", err);
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [searchTerm]);

  const handleDelete = async (userId: string) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    
    try {
      const response = await fetch(`http://localhost:8000/users/${userId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to delete user");
      }

      fetchUsers();
    } catch (err) {
      console.error("Error deleting user:", err);
      setError(err instanceof Error ? err.message : "Failed to delete user");
    }
  };

  if (loading) return <div className={styles.container}>Loading...</div>;
  if (error) return <div className={styles.error}>Error: {error}</div>;

  return (
    <div className={styles.container}>
      <div className={styles.top}>
        <Search placeholder="Search for a user..." />
        <Link href="/dashboard/users/add">
          <button className={styles.addButton}>Add New</button>
        </Link>
      </div>
      <table className={styles.table}>
        <thead>
          <tr>
            <td>Name</td>
            <td>Email</td>
            <td>Created At</td>
            <td>Role</td>
            <td>Status</td>
            <td>Action</td>
          </tr>
        </thead>
        <tbody>
          {users.length > 0 ? (
            users.map((user) => (
              <tr key={user.user_id}>
                <td>
                  <div className={styles.user}>
                    <Image
                      src="/icons8-avatar.png"
                      alt={user.username || "User avatar"}
                      width={40}
                      height={40}
                      className={styles.userImage}
                      priority={false}
                    />
                    {user.username}
                  </div>
                </td>
                <td>{user.email}</td>
                <td>{new Date(user.created_at).toLocaleDateString()}</td>
                <td>{user.role}</td>
                <td>
                  <span className={`${styles.status} ${styles[user.status]}`}>
                    {user.status}
                  </span>
                </td>
                <td>
                  <div className={styles.buttons}>
                    <Link href={`/dashboard/users/${user.user_id}`}>
                      <button className={`${styles.button} ${styles.view}`}>
                        View
                      </button>
                    </Link>
                    <button
                      className={`${styles.button} ${styles.delete}`}
                      onClick={() => handleDelete(user.user_id)}
                      disabled={user.cognito_sub === currentUserSub}
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={6} className={styles.noResults}>
                No users found
              </td>
            </tr>
          )}
        </tbody>
      </table>
      <Pagination />
    </div>
  );
};

export default UsersPage;