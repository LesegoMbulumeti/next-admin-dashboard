import Navbar from "../ui/dashboard/navbar/navbar";
import styles from "../ui/dashboard/dashboard.module.css";
import Footer from "../ui/dashboard/Footer/footer";
import { ReactNode } from "react";
import Sidebar from "../ui/dashboard/sidebar/sidebar";

type LayoutProps = {
    children: ReactNode;
  };

const Layout = ({ children }: LayoutProps) => {
    return (
        <div className={styles.container}>
            <div className={styles.menu}>
                <Sidebar/>
            </div>
            <div className={styles.content}>
                <Navbar/>
                {children}
                <Footer/>
            </div>
        </div>
    )

}

export default Layout;