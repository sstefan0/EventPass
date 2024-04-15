import { useEffect, useState } from "react";
import styles from "./add-tickets.module.css";
import { Button, MenuItem, TextField } from "@mui/material";
import Ticket from "../ticket/ticket";
import CloseIcon from "@mui/icons-material/Close";
import { getEventTicketTypes } from "../../util/getTicketTypes";
import { useNavigate } from "react-router-dom";
import callApi from "../../api/api";
import { TextFieldStyle } from "../../util/global-style";

interface Ticket {
  EventId: string;
  TicketTypeId: string;
  Price: number;
  Description: string;
  Amount: number;
}

interface TicketType {
  Id: string;
  Title: string;
}

const AddTickets = ({ eventId }: { eventId: string }) => {
  const [ticketForm, setTicketForm] = useState({
    type: "",
    description: "",
    price: 0,
    amount: 0,
  });
  const [eventTickets, setEventTickets] = useState<Ticket[]>([]);
  const [ticketTypes, setTicketTypes] = useState<TicketType[] | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const navigate = useNavigate();

  const handleAddTicket = (e: React.FormEvent) => {
    e.preventDefault();
    const newTicket: Ticket = {
      EventId: eventId,
      TicketTypeId: ticketForm.type,
      Price: ticketForm.price,
      Description: ticketForm.description,
      Amount: ticketForm.amount,
    };

    setEventTickets([...eventTickets, newTicket]);
  };
  const handleTicketsSubmit = async () => {
    setIsLoading(true);
    try {
      await callApi.Event.addTickets(eventTickets);
      setIsLoading(false);
      setIsSuccess(true);
      navigate(`/event/${eventId}`);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      const result = await getEventTicketTypes();
      setTicketTypes(result);
    };
    fetchData();
  }, []);

  return (
    <div className={styles.stepTwoContainer}>
      <form className={styles.eventDetailsContainer} onSubmit={handleAddTicket}>
        <TextField
          id="ticketTypeSelect"
          label="Ticket Type"
          variant="outlined"
          value={ticketForm.type}
          defaultValue=""
          sx={TextFieldStyle}
          onChange={(e) => {
            setTicketForm({ ...ticketForm, type: e.target.value });
          }}
          select
          required
          fullWidth
        >
          {ticketTypes && ticketTypes.length ? (
            ticketTypes.map((type: any) => (
              <MenuItem key={type.Id} value={type.Id}>
                {type.Title}
              </MenuItem>
            ))
          ) : (
            <MenuItem value={""}></MenuItem>
          )}
        </TextField>
        <div className={styles.row}>
          <TextField
            id="price"
            type="number"
            fullWidth
            name="price"
            label="Price"
            sx={TextFieldStyle}
            required
            onChange={(e) =>
              setTicketForm({ ...ticketForm, price: Number(e.target.value) })
            }
          />
          <TextField
            id="amount"
            type="number"
            fullWidth
            name="amount"
            label="Amount"
            sx={TextFieldStyle}
            required
            onChange={(e) =>
              setTicketForm({ ...ticketForm, amount: Number(e.target.value) })
            }
          />
        </div>
        <TextField
          type="text"
          multiline
          minRows={3}
          maxRows={6}
          sx={TextFieldStyle}
          fullWidth
          name="description"
          label="Description"
          onChange={(e) => {
            setTicketForm({ ...ticketForm, description: e.target.value });
          }}
        />
        <Button
          type="submit"
          variant="contained"
          fullWidth
          disabled={isLoading || isSuccess}
          sx={{
            background: "#00F5D0",
            "&:hover": {
              backgroundColor: "#00a39e",
              boxShadow: "none",
            },
          }}
        >
          Add Ticket
        </Button>
        <Button
          type="button"
          variant="contained"
          disabled={!eventTickets.length || isLoading || isSuccess}
          fullWidth
          onClick={handleTicketsSubmit}
          sx={{
            background: "#00F5D0",
            "&:hover": {
              backgroundColor: "#00a39e",
              boxShadow: "none",
            },
          }}
        >
          Submit tickets
        </Button>
      </form>
      <div className={styles.ticketsContainer}>
        <h3
          style={{
            position: "sticky",
            top: 0,
            right: 0,
            backgroundColor: "#90caf909",
            boxShadow: "10px  black",
            width: "100%",
            textAlign: "center",
            color: "white",
            margin: 0,
          }}
        >
          Tickets preview
        </h3>

        {eventTickets.length > 0 &&
          eventTickets.map((ticket, index) => (
            <div className={styles.row} key={index}>
              <Ticket
                id={""}
                title={ticket.Description}
                amount={ticket.Amount}
                description={ticket.Description}
                price={ticket.Price}
                key={"Ticket" + index}
                editing
              />
              <div
                onClick={() => {
                  let array = [
                    ...eventTickets.slice(0, index),
                    ...eventTickets.slice(index + 1),
                  ];

                  setEventTickets(array);
                }}
              >
                <CloseIcon className={styles.icon} />
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};

export default AddTickets;
