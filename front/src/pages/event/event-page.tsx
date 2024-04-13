import { useLoaderData } from "react-router-dom";
import EventDetails from "../../components/event-details/event-details";
import styles from "./event-page.module.css";
import TicketsList from "../../components/tickets-list/tickets-list";

export interface EventData {
  id: string;
  title: string;
  description: string;
  dateTime: string;
  location: string;
  city: string;
  cityId: string;
  eventTypeId: string;
  country: string;
  tickets: [
    {
      id: string;
      title: string;
      description: string;
      price: number;
      amount: number;
    }
  ];
  imageUrl: string;
}

const EventPage = () => {
  const data = useLoaderData() as EventData;

  return (
    <div className={styles.container}>
      <EventDetails eventData={data} />
      <TicketsList ticketsList={data.tickets} />
    </div>
  );
};

export default EventPage;
