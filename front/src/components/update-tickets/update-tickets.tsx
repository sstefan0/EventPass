import { useEffect, useState } from "react";
import styles from "./update-tickets.module.css";
import { Button, MenuItem, TextField } from "@mui/material";
import Ticket from "../ticket/ticket";
import CloseIcon from "@mui/icons-material/Close";
import { getEventTicketTypes } from "../../util/getTicketTypes";
import { useNavigate } from "react-router-dom";
import { EventData } from "../../pages/event/event-page";
import callApi from "../../api/api";
import EditIcon from "@mui/icons-material/Edit";
import { TextFieldStyle } from "../../util/global-style";

interface Ticket {
  EventId: string;
  TicketTypeId: string;
  Price: number;
  Description: string;
  Amount: number;
}
interface CreatedTicket {
  id: string;
  title: string;
  description: string;
  price: number;
  amount: number;
}

interface TicketType {
  Id: string;
  Title: string;
}

const UpdateTickets = ({
  eventId,
  eventData,
}: {
  eventId: string;
  eventData: EventData;
}) => {
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
  const [createdTickets, setCreatedTickets] = useState<CreatedTicket[]>(
    eventData.tickets
  );

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
    console.log(eventId);

    setEventTickets([...eventTickets, newTicket]);
  };

  const handleTicketsSubmit = async () => {
    setIsLoading(true);
    try {
      if (eventTickets.length) await callApi.Event.addTickets(eventTickets);
      setIsLoading(false);
      setIsSuccess(true);
      navigate("/dashboard");
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
  console.log(createdTickets);
  return (
    <div className={styles.stepTwoContainer}>
      <form className={styles.eventDetailsContainer} onSubmit={handleAddTicket}>
        <TextField
          id="ticketTypeSelect"
          label="Ticket Type"
          variant="outlined"
          value={ticketForm.type}
          sx={TextFieldStyle}
          defaultValue=""
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
            sx={TextFieldStyle}
            type="number"
            fullWidth
            name="price"
            label="Price"
            required
            onChange={(e) =>
              setTicketForm({ ...ticketForm, price: Number(e.target.value) })
            }
          />
          <TextField
            id="amount"
            type="number"
            sx={TextFieldStyle}
            fullWidth
            name="amount"
            label="Amount"
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
          sx={{
            background: "#00F5D0",
            "&:hover": {
              backgroundColor: "#00a39e",
              boxShadow: "none",
            },
          }}
          fullWidth
          onClick={handleTicketsSubmit}
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
        {createdTickets.length > 0 &&
          createdTickets.map((ticket, index) => (
            <div className={styles.row} key={index}>
              <Ticket
                id={ticket.id}
                title={ticket.title}
                amount={ticket.amount}
                description={ticket.description}
                price={ticket.price}
                key={ticket.id}
                editing
              />
            </div>
          ))}
      </div>
    </div>
  );
};

export default UpdateTickets;
