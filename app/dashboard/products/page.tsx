import styles from "@/app/ui/dashboard/product/product.module.css";
import Pagination from "@/app/ui/dashboard/pagination/pagination";
import Search from "../../ui/dashboard/search/search"
import Link from "next/link";
import Image from "next/image";

const ProductsPage = () => {
    return(
        <div className={styles.container}>
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
            <td>Created at</td>
            <td>Stock</td>
            <td>Action</td>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>
              {" "}
              <div className={styles.products}>
                <Image
                  src="/icons8-avatar.png"
                  alt=""
                  width={40}
                  height={40}
                  className={styles.productsImage}
                />
                Iphone
              </div>
            </td>
            <td>Iphone 16 Pro Max</td>
            <td>R 35,000,00</td>
            <td>March 24 2025</td>
            <td>5</td>
            <td>
              <div className={styles.buttons}>
                <Link href={"/dashboard/products/view"}>
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
    )
}

export default ProductsPage;