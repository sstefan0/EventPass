import Ticket from "../ticket/ticket";
import styles from "./tickets-list.module.css";
import Modal from "../modal/modal";

const TicketsList = ({
  ticketsList,
}: {
  ticketsList: [
    {
      id: string;
      title: string;
      description: string;
      price: number;
      amount: number;
    }
  ];
}) => {
  return (
    <div className={styles.container}>
      {ticketsList.map((ticket) => (
        <Ticket
          id={ticket.id}
          title={ticket.title}
          amount={ticket.amount}
          description={ticket.description}
          price={ticket.price}
          key={ticket.id}
        />
      ))}
    </div>
  );
};
export default TicketsList;
