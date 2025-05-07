"use client";
import { MdAnalytics, MdAttachMoney, MdDashboard, MdHelpCenter, MdLogout, MdOutlineSettings, MdPeople, MdShoppingBag, MdSupervisedUserCircle, MdWork } from "react-icons/md";
import styles from "./sidebar.module.css";
import MenuLink from "./menuLink/menulink";
import Image from "next/image";
import { signOut } from 'aws-amplify/auth';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

const menuItems = [
    {
        title:"Pages",
        list: [
            {
                title: "Dashboard",
                path: "/dashboard",
                icon: <MdDashboard/>,

            },
            {
                title: "Users",
                path: "/dashboard/users",
                icon: <MdSupervisedUserCircle/>,
            },
            {
                title: "Products",
                path: "/dashboard/products",
                icon: <MdShoppingBag/>,
            },
            {
                title: "Transactions",
                path: "/dashboard/transactions",
                icon: <MdAttachMoney/>,
            },

        ],
    },
    {
        title: "Analytics",
        list: [
            {
                title: "Revenue",
                path:"/dashboard/revenue",
                icon: <MdWork/>
            },
            {
                title: "Reports",
                path:"/dashboard/reports",
                icon: <MdAnalytics/>,
            },
            {
                title: "Teams",
                path:"/dashboard/teams",
                icon: <MdPeople/>,
            },
        ],
    },
    {
        title: "User",
        list: [
            {
                title: "Settings",
                path: "/dashboard/settings",
                icon: <MdOutlineSettings/>,
            },
            {
                title: "Help",
                path: "/dashboard/help",
                icon: <MdHelpCenter/>,
            },
        ],
    },

];

const Sidebar = () => {
    const [isSigningOut, setIsSigningOut] = useState(false);
    const router = useRouter();

    const handleSignOut = async () => {
        try {
            setIsSigningOut(true);
            await signOut();
            router.push('/login');
        } catch (error) {
            console.error('Error signing out:', error);
        } finally {
            setIsSigningOut(false);
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.user}>
                <Image className={styles.userImage} src="/icons8-avatar.png" alt="" width="50" height="50"/>
                <div className={styles.userDetail}>
                <span className={styles.username}>John Joe</span>
                <span className={styles.userTitle}>Administrator</span>
            </div>
            </div>
            <ul className={styles.list}>
                
            {menuItems.map((cat) =>(
            <li key={cat.title}>
             <span className={styles.cat}>{cat.title}</span>
              {cat.list.map((item) => (
                <MenuLink item={item} key={item.title} />
              
               ))}
             </li>
            ))}
            </ul>
             
            <button 
                className={styles.logout} 
                onClick={handleSignOut}
                disabled={isSigningOut}
            >
                <MdLogout/>
                {isSigningOut ? 'Signing out...' : 'Logout'}
            </button>
            
        </div>
    );
    }
export default Sidebar;