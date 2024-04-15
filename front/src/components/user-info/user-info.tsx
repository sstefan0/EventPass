import styles from "./user-info.module.css";
import AlternateEmailIcon from "@mui/icons-material/AlternateEmail";
import PhoneIcon from "@mui/icons-material/Phone";
import StarIcon from "@mui/icons-material/Star";
import Divider from "@mui/material/Divider";
import callApi from "../../api/api";

const UserInfo = (props: any) => {
  return (
    <div className={styles.container}>
      <h2>{props.data.FirstName + " " + props.data.LastName}</h2>
      <Divider color="#9c9583" />
      <div className={styles.row}>
        <div className={styles.title}>
          <AlternateEmailIcon />
          <h4 className={styles.visible}>Email:</h4>
        </div>
        <div className={styles.data}>
          <p> {props.data.Email}</p>
        </div>
      </div>
      <Divider color="#9c9583" />
      <div className={styles.row}>
        <div className={styles.title}>
          <PhoneIcon />
          <h4 className={styles.visible}>Phone:</h4>
        </div>
        <div className={styles.data}>
          <p>{props.data.PhoneNumber}</p>
        </div>
      </div>
      <Divider color="#9c9583" />
      <div className={styles.row}>
        <div className={styles.title}>
          <StarIcon />
          <h4 className={styles.visible}>Role:</h4>
        </div>
        <div className={styles.data}>
          <p> {props.data.Role}</p>
        </div>
      </div>
    </div>
  );
};

export const loader = async () => {
  try {
    const response = await callApi.Auth.userInfo();
    return response;
  } catch (error) {
    console.error(error);
  }
};

export default UserInfo;
