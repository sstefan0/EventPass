import styles from "./ticket.module.css";
import Modal from "../modal/modal";
import { Button } from "@mui/material";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { useState } from "react";
const Ticket = ({
  id,
  title,
  description,
  amount,
  price,
  editing,
}: {
  id: string;
  title: string;
  description: string;
  amount: number;
  price: number;
  editing: boolean;
}) => {
  const [available, setAvailable] = useState(amount);
  const onPurchase = (amountPurchased: number) => {
    setAvailable(available - amountPurchased);
  };
  const ticketId = id;
  const user = useSelector((state: RootState) => state.user.role);
  return (
    <div className={styles.container}>
      <div className={styles.row}>
        <h3 className={styles.title}>{title}</h3>
        <p className={styles.text}>Tickets left: {available}</p>
      </div>
      <div className={styles.row}>
        <h4 className={styles.text}>{description}</h4>
        <p className={styles.text}>Price: {price} KM</p>
      </div>
      <div className={styles.row}>
        {editing ? (
          <Button
            variant="contained"
            fullWidth
            sx={{ background: "#00F5D0" }}
            disabled
          >
            Buy
          </Button>
        ) : user === "USER" ? (
          <Modal
            ticketid={ticketId}
            title={title}
            description={description}
            price={price}
            amount={available}
            onPurchase={onPurchase}
          />
        ) : (
          <Button variant="contained" fullWidth color="primary" disabled>
            Log in as USER to buy tickets.
          </Button>
        )}
      </div>
    </div>
  );
};

export default Ticket;
