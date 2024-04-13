import {
  Alert,
  Button,
  CircularProgress,
  Input,
  InputLabel,
  MenuItem,
  Slide,
  TextField,
} from "@mui/material";
import { useEffect, useState } from "react";
import styles from "./add-event.module.css";
import { getEventTypes } from "../../util/getEventTypes";
import DoneIcon from "@mui/icons-material/Done";
import callApi from "../../api/api";

interface EventForm {
  title: string;
  type: string;
  description: string;
  date: string;
  country: string;
  city: string;
  address: string;
  file: File | null;
}

interface EventType {
  Id: string;
  Title: string;
}

interface City {
  Name: string;
  Id: string;
}

const AddEvent = ({ onCreated }: { onCreated: (eventId: string) => void }) => {
  const [addEventForm, setAddEventForm] = useState<EventForm>({
    title: "",
    type: "",
    description: "",
    date: "",
    country: "",
    city: "",
    address: "",
    file: null,
  });
  const [eventTypes, setEventTypes] = useState<EventType[] | null>(null);
  const [cities, setCities] = useState<City[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      if (!addEventForm.file) throw new Error("Image undefined");
      setIsLoading(true);
      formData.append("image", addEventForm.file);
      const image = await callApi.Event.uploadImage(formData);
      const eventData = {
        Title: addEventForm.title,
        Description: addEventForm.description,
        DateTime: addEventForm.date + ":00z",
        Location: addEventForm.address,
        cityId: addEventForm.city,
        ImageUrl: image.imageUrl,
        eventTypeId: addEventForm.type,
      };
      const newEvent = await callApi.Event.create(eventData);
      onCreated(newEvent.Id);
      setIsLoading(false);
      setIsSuccess(true);
    } catch (e) {
      setIsLoading(false);
      console.error(e);
    }
  };

  const handleCountryChange = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    console.log(e.target.value);
    const value = e.target?.value as string;

    if (value != "") {
      try {
        const citiesResponse = await callApi.Event.cities(value);
        setCities(citiesResponse);
      } catch (e) {
        setCities([]);
        setAddEventForm({ ...addEventForm, city: "" });
      }
    } else {
      setCities([]);
      setAddEventForm({ ...addEventForm, city: "" });
    }
    setAddEventForm({ ...addEventForm, country: value });
  };

  useEffect(() => {
    const fetchData = async () => {
      const result = await getEventTypes();
      setEventTypes(result);
    };
    fetchData();
  }, []);

  return (
    <div className={styles.container}>
      <form className={styles.eventDetailsContainer} onSubmit={handleSubmit}>
        <TextField
          variant="outlined"
          type="text"
          name="title"
          label="Title"
          fullWidth
          required
          onChange={(e) => {
            setAddEventForm({ ...addEventForm, title: e.target.value });
          }}
        />
        <TextField
          id="eventTypeSelect"
          label="Event Type"
          variant="outlined"
          value={addEventForm.type}
          defaultValue=""
          onChange={(e) => {
            setAddEventForm({ ...addEventForm, type: e.target.value });
          }}
          select
          required
          fullWidth
        >
          {eventTypes && eventTypes.length ? (
            eventTypes.map((type: any) => (
              <MenuItem key={type.Id} value={type.Id}>
                {type.Title}
              </MenuItem>
            ))
          ) : (
            <MenuItem value={""}></MenuItem>
          )}
        </TextField>
        <TextField
          type="text"
          multiline
          minRows={3}
          maxRows={6}
          fullWidth
          name="description"
          label="Description"
          required
          onChange={(e) => {
            setAddEventForm({
              ...addEventForm,
              description: e.target.value,
            });
          }}
        />
        <div style={{ width: "100%" }}>
          <InputLabel htmlFor="dateTime" shrink required>
            Date & Time
          </InputLabel>
          <TextField
            id="dateTime"
            type="datetime-local"
            name="eventDate"
            required
            fullWidth
            onChange={(e) => {
              setAddEventForm({ ...addEventForm, date: e.target.value });
            }}
          />
        </div>
        <div className={styles.row}>
          <TextField
            id="demo-simple-select"
            label="Country"
            onChange={handleCountryChange}
            variant="outlined"
            defaultValue={""}
            value={addEventForm.country}
            select
            required
            fullWidth
          >
            <MenuItem value={""}></MenuItem>
            <MenuItem value={"SRB"}>Serbia</MenuItem>
            <MenuItem value={"BIH"}>Bosnia & Herzegovina</MenuItem>
            <MenuItem value={"CRO"}>Croatia</MenuItem>
            <MenuItem value={"MNE"}>Montenegro</MenuItem>
          </TextField>
          <TextField
            id="city-select"
            label="City"
            variant="outlined"
            value={addEventForm.city}
            defaultValue=""
            onChange={(e) => {
              console.log(e.target.value);
              setAddEventForm({ ...addEventForm, city: e.target.value });
            }}
            select
            required
            fullWidth
          >
            {cities.length ? (
              cities.map((city: any) => (
                <MenuItem key={city.Id} value={city.Id}>
                  {city.Name}
                </MenuItem>
              ))
            ) : (
              <MenuItem value={""}>Select a country first</MenuItem>
            )}
          </TextField>
        </div>
        <TextField
          id="address"
          type="text"
          fullWidth
          name="eventDate"
          label="Address"
          required
          onChange={(e) =>
            setAddEventForm({ ...addEventForm, address: e.target.value })
          }
        />
        <div className={styles.row}>
          <Input
            type="file"
            inputProps={{ accept: "image/*" }}
            required
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              if (e.target.files && e.target.files.length)
                setAddEventForm({
                  ...addEventForm,
                  file: e.target.files[0],
                });
            }}
          ></Input>
          <Button
            type="submit"
            variant="contained"
            color={isSuccess ? "success" : "primary"}
            disabled={isLoading || isSuccess}
            fullWidth
          >
            {isLoading ? (
              <CircularProgress />
            ) : isSuccess ? (
              <DoneIcon />
            ) : (
              "Create event"
            )}
          </Button>
        </div>
        {isSuccess && (
          <Slide direction="right" in mountOnEnter unmountOnExit>
            <Alert
              severity="success"
              variant="outlined"
              sx={{ position: "absolute", bottom: "10px" }}
            >
              Event successfuly created
            </Alert>
          </Slide>
        )}
      </form>
    </div>
  );
};

export default AddEvent;
