import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import { CardActionArea } from "@mui/material";
import styles from "./event-card.module.css";
import FmdGoodOutlinedIcon from "@mui/icons-material/FmdGoodOutlined";
import AccessTimeOutlinedIcon from "@mui/icons-material/AccessTimeOutlined";
import PropTypes from "prop-types";

const ActionAreaCard = ({
  eventName,
  eventLocation,
  eventDateTime,
}: {
  eventName: string;
  eventLocation: string;
  eventDateTime: string;
}) => {
  const driveUrl =
    "https://drive.google.com/file/d/14VttGRwTP6ueqhKiDMb5mRFf3ANOLmfG/view?usp=drive_link";

  return (
    <Card className={styles.eventCard}>
      <CardActionArea>
        <CardMedia
          component="img"
          height="140"
          image="https://gigstix.ba/wp-content/uploads/2024/01/Ok-fest-2024_banner_820x312.jpg"
          alt="green iguana"
        />
        <CardContent>
          <Typography gutterBottom variant="h5" component="div">
            {eventName}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            <span className={styles.info}>
              <FmdGoodOutlinedIcon className={styles.icon} /> {eventLocation}
            </span>
          </Typography>
          <Typography variant="body2" color="text.secondary">
            <span className={styles.info}>
              <AccessTimeOutlinedIcon className={styles.icon} />{" "}
              {new Date(eventDateTime).toLocaleString()}
            </span>
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
};

ActionAreaCard.propTypes = {
  eventName: PropTypes.string.isRequired, // Here we specify that the eventName prop is required and must be a string
};

export default ActionAreaCard;
