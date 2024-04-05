import { Paper, Typography } from "@mui/material";
import { EventData } from "../../pages/event/event-page";
import styles from "./event-details.module.css";
import FmdGoodOutlined from "@mui/icons-material/FmdGoodOutlined";
import AccessTimeOutlined from "@mui/icons-material/AccessTimeOutlined";

const EventDetails = ({ eventData }: { eventData: EventData }) => {
  return (
    <div className={styles.container}>
      <div className={styles.imageContainer}>
        <img
          src={eventData.imageUrl}
          alt="event image"
          className={styles.image}
        />
        <div className={styles.titleDiv}>
          <h1 className={styles.title}>{eventData.title}</h1>
        </div>
      </div>
      <Paper elevation={10}>
        <div className={styles.descriptionDiv}>
          <Typography variant="body2" color="text.secondary">
            <span className={styles.info}>
              <Typography variant="body2" color="#90caf9">
                <FmdGoodOutlined className={styles.icon} />
              </Typography>
              {eventData.location}
            </span>
          </Typography>
          <Typography variant="body2" color="text.secondary">
            <span className={styles.info}>
              <Typography variant="body2" color="#90caf9">
                <AccessTimeOutlined />{" "}
              </Typography>
              {new Date(eventData.dateTime).toLocaleString()}
            </span>
          </Typography>
          <p>{eventData.description}</p>
        </div>
      </Paper>
    </div>
  );
};

export default EventDetails;
