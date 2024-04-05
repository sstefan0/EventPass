import styles from "./ticket.module.css";
import Modal from "../modal/modal";
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
        <Modal
          ticketid={ticketId}
          title={title}
          description={description}
          price={price}
        />
      </div>
    </div>
  );
};

export default Ticket;
