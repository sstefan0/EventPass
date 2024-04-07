import styles from "./ticket.module.css";
import Modal from "../modal/modal";
import { Button } from "@mui/material";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
const Ticket = ({
  id,
  title,
  description,
  amount,
  price,
}: {
  id: string;
  title: string;
  description: string;
  amount: number;
  price: number;
}) => {
  const ticketId = id;
  const loggedIn = useSelector((state: RootState) => state.user.isLoggedIn);
  return (
    <div className={styles.container}>
      <div className={styles.row}>
        <h3 className={styles.title}>{title}</h3>
        <p className={styles.text}>Tickets left: {amount}</p>
      </div>
      <div className={styles.row}>
        <h4 className={styles.text}>{description}</h4>
        <p className={styles.text}>Price: {price} KM</p>
      </div>
      <div className={styles.row}>
        {loggedIn ? (
          <Modal
            ticketid={ticketId}
            title={title}
            description={description}
            price={price}
          />
        ) : (
          <Button variant="contained" fullWidth color="primary" disabled>
            Log in to buy tickets.
          </Button>
        )}
      </div>
    </div>
  );
};

export default Ticket;
