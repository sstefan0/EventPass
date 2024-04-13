import Ticket from "../ticket/ticket";
import styles from "./tickets-list.module.css";

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
      {ticketsList.length ? (
        ticketsList.map((ticket) => (
          <Ticket
            id={ticket.id}
            title={ticket.title}
            amount={ticket.amount}
            description={ticket.description}
            price={ticket.price}
            key={ticket.id}
            editing={false}
          />
        ))
      ) : (
        <h1>Tickets coming soon...</h1>
      )}
    </div>
  );
};
export default TicketsList;
