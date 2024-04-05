import EventCard from "../event-card/event-card";
import styles from "./event-card-list.module.css";
import { useLoaderData } from "react-router-dom";
import { Fab } from "@mui/material";
import FilterAltIcon from "@mui/icons-material/FilterAlt";

const EventList = () => {
  const data: any = useLoaderData();
  console.log(data);

  return (
    <>
      <ul className={styles.eventsList}>
        {data.map((eventData: any) => (
          <EventCard
            key={eventData.Id}
            eventName={eventData.Title}
            eventLocation={eventData.Location}
            eventDateTime={eventData.DateTime}
            eventId={eventData.Id}
            eventImage={eventData.ImageUrl}
          />
        ))}
      </ul>
      <Fab color="primary" sx={{ position: "fixed", bottom: 16, right: 16 }}>
        <FilterAltIcon />
      </Fab>
    </>
  );
};

export default EventList;

export const loader = async () => {
  const response = await fetch("http://localhost:3000/event/get-all");
  const resData = await response.json();
  return resData;
};
