import * as React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import Stepper from "../stepper/stepper";
import styles from "./modal.module.css";
import { BorderBottom } from "@mui/icons-material";

const style = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "30%",
  height: "50%",
  bgcolor: "background.paper",
  // border: "2px solid #000",
  borderTopLeftRadius: "20px",
  borderBottomRightRadius: "20px",
  borderBottom: "3px solid #00F5D0",
  boxShadow: 24,
  p: 4,
};

export default function BasicModal({
  ticketid,
  title,
  description,
  price,
  amount,
  onPurchase,
}: {
  ticketid: string;
  title: string;
  description: string;
  price: number;
  amount: number;
  onPurchase: (amountPurchased: number) => void;
}) {
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <div className={styles.container}>
      <Button
        sx={{
          background: "#00F5D0",
          "&:hover": {
            backgroundColor: "#00a39e",
            boxShadow: "none",
          },
        }}
        type="submit"
        variant="contained"
        fullWidth
        color="primary"
        onClick={handleOpen}
        disabled={!amount}
      >
        Buy
      </Button>{" "}
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            <Stepper
              onFinish={handleClose}
              ticketId={ticketid}
              title={title}
              description={description}
              price={price}
              availableAmount={amount}
              onPurchase={onPurchase}
            />
          </Typography>
        </Box>
      </Modal>
    </div>
  );
}
