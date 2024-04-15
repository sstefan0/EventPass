import EventCard from "../event-card/event-card";
import styles from "./event-card-list.module.css";
import {
  useLoaderData,
  useNavigate,
  useParams,
  useRevalidator,
} from "react-router-dom";
import Filters from "../filters/filters";
import { Pagination, SelectChangeEvent } from "@mui/material";
import { ChangeEvent, useEffect, useState } from "react";
import useWindowDimensions from "../../hooks/useWindowDimensions";
import callApi from "../../api/api";

interface City {
  Name: string;
  Id: string;
}

const EventList = () => {
  const data: any = useLoaderData();
  const params = useParams();

  const [cities, setCities] = useState<City[]>([]);
  const [city, setCity] = useState("");
  const [country, setCountry] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [displayData, setDisplayData] = useState(data);
  const [page, setPage] = useState(1);
  const [displayCount, setDisplayCount] = useState(6);
  const [pagesNumber, setPagesNumber] = useState(
    Math.ceil(data.length / displayCount)
  );

  const { width } = useWindowDimensions();
  const isMobile = width < 768;
  useEffect(() => {
    if (isMobile) {
      setDisplayCount(displayData.length);
      setPage(1);
    } else setDisplayCount(6);
  }, [isMobile]);

  useEffect(() => {
    setDisplayData(data);
    setPage(1);
    setPagesNumber(Math.ceil(data.length / displayCount));
  }, [params.id]);

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
    setCity("");

    if (value != "") {
      try {
        const response = await callApi.Event.cities(value);
        setCities(response);
      } catch (error) {
        console.error(error);
      }
    } else {
      setCities([]);
    }
    setCountry(value);
  };

  const handleChange = (e: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
  };
  const getDisplayData = () => {
    const tempDataArray: any[] = [];
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
    setPage(1);
    setPagesNumber(Math.ceil(tempDataArray.length / 6));
  };
  const handleReset = () => {
    setCities([]);
    setCountry("");
    setCity("");
    setEndDate("");
    setStartDate("");
    setDisplayData(data);
    setPage(1);
    setPagesNumber(Math.ceil(data.length / 6));
  };
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        width: "100%",
      }}
      key={params ? params.id : "appbardiv"}
    >
      <ul className={styles.eventsList}>
        {displayData.length !== 0 ? (
          displayData
            .slice(
              (page - 1) * displayCount,
              (page - 1) * displayCount + displayCount
            )
            .map((eventData: any) => (
              <EventCard
                key={eventData.Id}
                eventName={eventData.Title}
                eventLocation={eventData.Location}
                eventDateTime={eventData.DateTime}
                eventId={eventData.Id}
                eventImage={eventData.ImageUrl}
              />
            ))
        ) : (
          <h1>No events in this category</h1>
        )}
      </ul>
      {!isMobile && (
        <Pagination
          count={pagesNumber}
          onChange={handleChange}
          page={page}
          sx={{ position: "absolute", bottom: "5px" }}
        />
      )}

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
    </div>
  );
};

export default EventList;

export const loader = async () => {
  const response = await callApi.Event.getAll();
  return response;
};
