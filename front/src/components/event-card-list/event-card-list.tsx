import EventCard from "../event-card/event-card";
import styles from "./event-card-list.module.css";
import { Route, Routes, useLoaderData } from "react-router-dom";

const EventList = () => {
  const data: any = useLoaderData();

  return (
    <ul className={styles.eventsList}>
      {data.map((eventData: any) => (
        <EventCard
          key={eventData.Id}
          eventName={eventData.Title}
          eventLocation={eventData.Location}
          eventDateTime={eventData.DateTime}
        />
      ))}
    </ul>
  );
};

export default EventList;

export const loader = async () => {
  const response = await fetch("http://localhost:3000/event/get-all");
  const resData = await response.json();
  return resData;
};
