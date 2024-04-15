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
import React, { FormEventHandler, useEffect, useState, useRef } from "react";
import styles from "./update-event.module.css";
import { getEventTypes } from "../../util/getEventTypes";
import DoneIcon from "@mui/icons-material/Done";
import { EventData } from "../../pages/event/event-page";
import dayjs, { Dayjs } from "dayjs";
import callApi from "../../api/api";
import { TextFieldStyle } from "../../util/global-style";

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

const UpdateEvent = ({ eventData }: { eventData: EventData }) => {
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

  useEffect(() => {
    setAddEventForm({
      title: eventData.title,
      type: eventData.eventTypeId,
      description: eventData.description,
      date: eventData.dateTime,
      country: eventData.country,
      city: eventData.cityId,
      address: eventData.location,
      file: null,
    });
    loadCities(eventData.country);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("dobar daaaan");
    try {
      const formData = new FormData();
      let imageUrl;
      if (!addEventForm.file) {
        imageUrl = null;
      } else {
        setIsLoading(true);
        formData.append("image", addEventForm.file);
        imageUrl = await callApi.Event.uploadImage(formData);
      }
      let body: any = {};
      body.Id = eventData.id;
      if (addEventForm.title != "") body.Title = addEventForm.title;
      if (addEventForm.description != "")
        body.Description = addEventForm.description;
      if (addEventForm.date != "")
        body.DateTime =
          addEventForm.date.length < 24
            ? addEventForm.date + ":00z"
            : addEventForm.date;
      if (addEventForm.address != "") body.Location = addEventForm.address;
      if (addEventForm.city != "") body.cityId = addEventForm.city;
      if (imageUrl) body.ImageUrl = imageUrl.imageUrl;
      if (addEventForm.type != "") body.eventTypeId = addEventForm.type;
      await callApi.Event.update(body);
      setIsLoading(false);
      setIsSuccess(true);
    } catch (error) {
      setIsLoading(false);
      console.error(error);
    }
  };

  const loadCities = async (value: string) => {
    try {
      const response = await callApi.Event.cities(value);
      setCities(response);
    } catch (error) {
      console.error(error);
    }
  };
  const handleCountryChange = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    console.log(e.target.value);
    const value = e.target?.value as string;

    if (value != "") {
      loadCities(value);
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
        <div style={{ width: "100%" }}>
          <TextField
            id="titleField"
            variant="outlined"
            sx={TextFieldStyle}
            label="Title"
            type="text"
            name="title"
            fullWidth
            value={addEventForm.title}
            onChange={(e) => {
              setAddEventForm({ ...addEventForm, title: e.target.value });
            }}
          />
        </div>
        <TextField
          id="eventTypeSelect"
          label="Event Type"
          sx={TextFieldStyle}
          variant="outlined"
          value={addEventForm.type}
          defaultValue=""
          onChange={(e) => {
            setAddEventForm({ ...addEventForm, type: e.target.value });
          }}
          select
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
        <div style={{ width: "100%" }}>
          <TextField
            id="description"
            sx={TextFieldStyle}
            type="text"
            label="Description"
            multiline
            minRows={3}
            maxRows={3}
            fullWidth
            name="description"
            value={addEventForm.description}
            onChange={(e) => {
              setAddEventForm({
                ...addEventForm,
                description: e.target.value,
              });
            }}
          />
        </div>
        <div style={{ width: "100%" }}>
          <TextField
            id="dateTime"
            label="Date & Time"
            type="datetime-local"
            sx={TextFieldStyle}
            name="eventDate"
            fullWidth
            value={dayjs(new Date(addEventForm.date)).format(
              "YYYY-MM-DDTHH:mm"
            )}
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
            sx={TextFieldStyle}
            defaultValue={""}
            value={addEventForm.country}
            select
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
            sx={TextFieldStyle}
            value={addEventForm.city}
            defaultValue=""
            onChange={(e) => {
              console.log(e.target.value);
              setAddEventForm({ ...addEventForm, city: e.target.value });
            }}
            select
            fullWidth
          >
            {cities.length ? (
              cities.map((city: any) => (
                <MenuItem key={city.Id} value={city.Id}>
                  {city.Name}
                </MenuItem>
              ))
            ) : (
              <MenuItem value={""}>{eventData.city}</MenuItem>
            )}
          </TextField>
        </div>
        <div style={{ width: "100%" }}>
          <TextField
            id="address"
            sx={TextFieldStyle}
            label="Address"
            type="text"
            fullWidth
            value={addEventForm.address}
            name="eventAddress"
            onChange={(e) =>
              setAddEventForm({ ...addEventForm, address: e.target.value })
            }
          />
        </div>
        <div className={styles.row}>
          <Input
            type="file"
            inputProps={{ accept: "image/*" }}
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
            sx={{ background: "#00F5D0", "&:hover": { background: "#00a39e" } }}
            color={isSuccess ? "success" : "primary"}
            disabled={isLoading || isSuccess}
            fullWidth
          >
            {isLoading ? (
              <CircularProgress />
            ) : isSuccess ? (
              <DoneIcon />
            ) : (
              "Update event"
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
              Event successfuly updated
            </Alert>
          </Slide>
        )}
      </form>
    </div>
  );
};

export default UpdateEvent;
