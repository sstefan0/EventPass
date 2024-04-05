import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import { CardActionArea } from "@mui/material";
import styles from "./event-card.module.css";
import FmdGoodOutlinedIcon from "@mui/icons-material/FmdGoodOutlined";
import AccessTimeOutlinedIcon from "@mui/icons-material/AccessTimeOutlined";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";

const ActionAreaCard = ({
  eventName,
  eventLocation,
  eventDateTime,
  eventId,
  eventImage,
}: {
  eventName: string;
  eventLocation: string;
  eventDateTime: string;
  eventId: string;
  eventImage: string;
}) => {
  const navigate = useNavigate();
  const handleClick = () => {
    navigate("/event/" + eventId);
  };
  return (
    <div onClick={handleClick} className={styles.eventCard}>
      <Card>
        <CardActionArea>
          <CardMedia
            component="img"
            height="140"
            image={eventImage}
            alt="green iguana"
          />
          <CardContent>
            <Typography gutterBottom variant="h5" component="div">
              {eventName}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              <span className={styles.info}>
                <FmdGoodOutlinedIcon className={styles.icon} color="primary" />{" "}
                {eventLocation}
              </span>
            </Typography>
            <Typography variant="body2" color="text.secondary">
              <span className={styles.info}>
                <AccessTimeOutlinedIcon
                  className={styles.icon}
                  color="primary"
                />{" "}
                {new Date(eventDateTime).toLocaleString()}
              </span>
            </Typography>
          </CardContent>
        </CardActionArea>
      </Card>
    </div>
  );
};

ActionAreaCard.propTypes = {
  eventName: PropTypes.string.isRequired, // Here we specify that the eventName prop is required and must be a string
};

export default ActionAreaCard;
