import EventCard from "../event-card/event-card";
import styles from "./event-card-list.module.css";
import { useLoaderData } from "react-router-dom";
import Filters from "../filters/filters";
import { SelectChangeEvent } from "@mui/material";
import { ChangeEvent, useState } from "react";

interface City {
  Name: string;
  Id: string;
}

const EventList = () => {
  const data: any = useLoaderData();
  console.log(data);

  const [cities, setCities] = useState<City[]>([]);
  const [city, setCity] = useState("");
  const [country, setCountry] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [displayData, setDisplayData] = useState(data);

  const handleCityChange = (e: SelectChangeEvent<unknown>) => {
    console.log(e.target.value);
    setCity(e.target.value as string);
  };
  const handleStartDateChange = (e: ChangeEvent<HTMLInputElement>) => {
    console.log(e.target.value);
    setStartDate(e.target.value as string);
  };
  const handleEndDateChange = (e: ChangeEvent<HTMLInputElement>) => {
    console.log(e.target.value);
    setEndDate(e.target.value as string);
  };
  const handleCountryChange = async (e: SelectChangeEvent<unknown>) => {
    console.log(e.target.value);
    const value = e.target?.value as string;
    console.log(data);

    if (value != "") {
      const response = await fetch(
        "http://localhost:3000/cities?country=" + value,
        {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("accessToken"),
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        const resData = await response.json();
        setCities(resData);
      }
    } else {
      setCities([]);
      setCity("");
    }
    setCountry(value);
  };
  const getDisplayData = () => {
    const tempDataArray: any[] = [];
    console.log(city, country, startDate, endDate);
    data.forEach((element: any) => {
      const eventTime = new Date(element.DateTime);

      if (
        (element.City.Country == country || !country) &&
        (element.cityId == city || !city) &&
        (eventTime > new Date(startDate) || !startDate) &&
        (eventTime < new Date(endDate) || !endDate)
      ) {
        tempDataArray.push(element);
      }
    });
    setDisplayData(tempDataArray);
  };
  const handleReset = () => {
    setCities([]);
    setCountry("");
    setCity("");
    setEndDate("");
    setStartDate("");
    setDisplayData(data);
  };
  return (
    <>
      <ul className={styles.eventsList}>
        {displayData.map((eventData: any) => (
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
      <Filters
        onCountry={handleCountryChange}
        onCity={handleCityChange}
        onEndDate={handleEndDateChange}
        onStartDate={handleStartDateChange}
        onApply={getDisplayData}
        onReset={handleReset}
        country={country}
        cities={cities}
        city={city}
      />
    </>
  );
};

export default EventList;

export const loader = async () => {
  const response = await fetch("http://localhost:3000/event/get-all");
  const resData = await response.json();
  return resData;
};
