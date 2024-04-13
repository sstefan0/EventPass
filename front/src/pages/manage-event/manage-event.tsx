import { useLoaderData, useNavigate } from "react-router-dom";
import EventForm from "../../components/event-form/event-form";
import styles from "./manage-event.module.css";
import { EventData } from "../event/event-page";
import { getAuth } from "../../util/get-auth";
import { useEffect } from "react";

const ManageEvent = () => {
  const navigate = useNavigate();
  const user = getAuth();

  useEffect(() => {
    if (user !== "ORGANIZER") navigate("/");
  }, [user]);

  const data = useLoaderData() as EventData;

  return (
    <div className={styles.container}>{<EventForm eventData={data} />}</div>
  );
};

export default ManageEvent;
