import { redirect, useLoaderData, useNavigate } from "react-router-dom";
import CustomizedTables from "../../components/purchase-history/purchase-history";
import UserInfo from "../../components/user-info/user-info";
import styles from "./profile.module.css";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import callApi from "../../api/api";
interface LoaderData {
  userData: any;
  purchases: any;
}
const Profile = () => {
  const user = useSelector((state: RootState) => state.user.role);
  const navigate = useNavigate();
  useEffect(() => {
    if (user !== "USER") navigate("/");
  }, [user]);
  const { userData, purchases } = useLoaderData() as LoaderData;
  return (
    <div className={styles.container}>
      <div className={styles.column}>
        <UserInfo data={userData} />
      </div>
      <CustomizedTables purchases={purchases} />
    </div>
  );
};

export default Profile;

export const loader = async () => {
  try {
    const response = await callApi.Purchase.history();
    return response;
  } catch (error) {
    console.error(error);
  }
};
