import { useEffect, useState } from "react";
import Service from "../utils/http";
import styles from './Profile.module.css';

const Profile = () => {
    const service = new Service();
    const [userData, setUserData] = useState(null);

    const getData = async () => {
        try {
            const response = await service.get("user/me");
            console.log('User Data:', response);
            // Make sure we're accessing the data property from the response
            const data = response.data || response;
            setUserData(data);
        } catch (error) {
            console.error('Error fetching user data:', error);
        }
    };

    useEffect(() => {
        getData();
    }, []);

    return (
        <div className={styles.container}>
            <h1 className={styles.title}>Profile Page</h1>
            {userData && (
                <div className={styles.userInfo}>
                    <h2 className={styles.title}>User Information</h2>
                    <img 
                        src={userData?.avatar || userData?.profilePicture || "https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y"} 
                        alt="Profile" 
                        className={styles.profileImage}
                        onError={(e) => {
                            e.target.src = "https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y";
                        }}
                    />
                    <div>
                        <div className={styles.infoRow}>
                            <span className={styles.label}>Name:</span>
                            <span className={styles.value}>{userData?.name}</span>
                        </div>
                        <div className={styles.infoRow}>
                            <span className={styles.label}>Email:</span>
                            <span className={styles.value}>{userData?.email}</span>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Profile;