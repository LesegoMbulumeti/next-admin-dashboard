import styles from "@/app/ui/dashboard/users/users.module.css";
import Search from "../../ui/dashboard/search/search";
import Link from "next/link";
import Image from "next/image";
import Pagination from "../../ui/dashboard/pagination/pagination";


const userPage = () => {
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
            <td>Created at</td>
            <td>Role</td>
            <td>Status</td>
            <td>Action</td>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>
              {" "}
              <div className={styles.user}>
                <Image
                  src="/icons8-avatar.png"
                  alt=""
                  width={40}
                  height={40}
                  className={styles.userImage}
                />
                Kholofelo Mabusa
              </div>
            </td>
            <td>Kholofelo@gmail.com</td>
            <td>10.04.2025</td>
            <td>Admin</td>
            <td>active</td>
            <td>
              <div className={styles.buttons}>
                <Link href={"/dashboard/users/test"}>
                  <button className={`${styles.button} ${styles.view}`}>
                    View
                  </button>
                </Link>

                <button className={`${styles.button} ${styles.delete}`}>
                  Delete
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
      <Pagination/>
    </div>
  );
};

export default userPage;
