import {
  TextField,
  Select,
  MenuItem,
  Button,
  Fab,
  InputLabel,
} from "@mui/material";
import FilterListIcon from "@mui/icons-material/Filterlist";
import { useState } from "react";
import styles from "./filters.module.css";
import CloseIcon from "@mui/icons-material/Close";

const Filters = (props: any) => {
  const [isVisible, setIsVisible] = useState(false);

  const handleClick = () => {
    setIsVisible(!isVisible);
  };

  console.log(props.handleCountryChange);
  return (
    <>
      <Fab
        color="primary"
        sx={{ position: "fixed", bottom: 16, right: 16 }}
        onClick={handleClick}
      >
        {isVisible ? <CloseIcon /> : <FilterListIcon />}
      </Fab>

      <div
        className={`${styles.filtersDiv} ${isVisible ? styles.visible : ""}`}
      >
        <div>
          <TextField
            id="demo-simple-select"
            label="Country"
            fullWidth
            onChange={props.onCountry}
            variant="outlined"
            defaultValue={""}
            value={props.country}
            select
          >
            <MenuItem value={""}>Any Country</MenuItem>
            <MenuItem value={"SRB"}>Serbia</MenuItem>
            <MenuItem value={"BIH"}>Bosnia & Herzegovina</MenuItem>
            <MenuItem value={"CRO"}>Croatia</MenuItem>
            <MenuItem value={"MNE"}>Montenegro</MenuItem>
          </TextField>
        </div>

        <div>
          <TextField
            id="city-select"
            label="City"
            fullWidth
            variant="outlined"
            value={props.city}
            defaultValue=""
            onChange={props.onCity}
            select
          >
            {props.cities.length ? (
              props.cities.map((city: any) => (
                <MenuItem key={city.Id} value={city.Id}>
                  {city.Name}
                </MenuItem>
              ))
            ) : (
              <MenuItem value={""}>Select a country first</MenuItem>
            )}
          </TextField>
        </div>
        <div>
          <InputLabel htmlFor="Date_From">Date From</InputLabel>
          <TextField
            id="Date_From"
            type="date"
            variant="outlined"
            onChange={props.onStartDate}
            fullWidth
          />
        </div>
        <div>
          <InputLabel htmlFor="Date_To">Date To</InputLabel>
          <TextField
            id="Date_To"
            type="date"
            variant="outlined"
            onChange={props.onEndDate}
            fullWidth
          />
        </div>

        <Button variant="contained" color="primary" onClick={props.onApply}>
          Apply Filters
        </Button>
        <Button variant="contained" color="error" onClick={props.onReset}>
          Reset Filters
        </Button>
      </div>
    </>
  );
};

export default Filters;
