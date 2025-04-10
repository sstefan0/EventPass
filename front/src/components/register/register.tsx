import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import { useEffect, useState } from "react";
import styles from "./register.module.css";
import QuestionMarkIcon from "@mui/icons-material/QuestionMark";
import MenuItem from "@mui/material/MenuItem";
import Tooltip from "@mui/material/Tooltip";
import React from "react";
import Typography from "@mui/material/Typography";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { login } from "../../redux/user/user-slice";
import callApi from "../../api/api";
import { TextFieldStyle } from "../../util/global-style";

const Register = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [role, setRole] = useState("USER");
  const [emailUnavailable, setEmailUnavailable] = useState(false);

  const dispatch = useDispatch();

  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await callApi.Auth.register({
        firstName,
        lastName,
        email,
        phoneNumber,
        password,
        role,
      });

      if (response) {
        const loginData = await callApi.Auth.login({ email, password });

        if (login) {
          localStorage.setItem("accessToken", loginData.accessToken);
          dispatch(login({ accessToken: loginData.accessToken }));
          navigate("/");
        }
      }
    } catch (error: any) {
      if (error.response.status === 409) setEmailUnavailable(true);
    }
  };

  return (
    <div className={styles.formContainer}>
      <form onSubmit={handleRegister} className={styles.loginForm}>
        <img src="./logo-hd.svg" alt="logo" className={styles.logoImage} />
        <div className={styles.row}>
          <TextField
            label="First name"
            variant="outlined"
            name="firstName"
            type="text"
            sx={TextFieldStyle}
            onChange={(e) => setFirstName(e.target.value)}
            required
            autoFocus
          />
          <TextField
            label="Last name"
            variant="outlined"
            name="lastName"
            sx={TextFieldStyle}
            type="text"
            onChange={(e) => setLastName(e.target.value)}
            required
            autoFocus
          />
        </div>
        <TextField
          label="Email"
          variant="outlined"
          name="email"
          sx={TextFieldStyle}
          type="email"
          onChange={(e) => setEmail(e.target.value)}
          required
          autoFocus
          error={emailUnavailable}
          helperText={
            emailUnavailable
              ? "There's already an account with this email address."
              : ""
          }
        />

        <TextField
          label="Password"
          variant="outlined"
          sx={TextFieldStyle}
          name="password"
          type="password"
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <TextField
          label="Phone number"
          variant="outlined"
          sx={TextFieldStyle}
          name="phoneNumber"
          type="text"
          onChange={(e) => setPhoneNumber(e.target.value)}
          required
        />
        <div className={styles.row}>
          <TextField
            label="Role"
            sx={{ ...TextFieldStyle, width: "100%" }}
            select
            onChange={(e) => setRole(e.target.value)}
            required
            defaultValue={"USER"}
          >
            <MenuItem value="USER">User</MenuItem>
            <MenuItem value="ORGANIZER">Organizer</MenuItem>
          </TextField>
          <Tooltip
            title={
              <React.Fragment>
                <Typography color="inherit">Which role to choose?</Typography>
                {"Choose"} <b>{"User"}</b>
                {" if you want to browse and purchase event tickets."}
                <br />
                {"Choose"} <b>{"Organizer"}</b>{" "}
                {"if you want to publish and sell tickets for your own events."}
              </React.Fragment>
            }
            about="aaaa"
            placement="right"
          >
            <QuestionMarkIcon sx={{ color: "#2274A5" }} />
          </Tooltip>
        </div>
        <Button
          type="submit"
          fullWidth
          variant="contained"
          sx={{
            background: "#00F5D0",
            "&:hover": {
              backgroundColor: "#00a39e",
              boxShadow: "none",
            },
          }}
          color="info"
        >
          Register
        </Button>
        <a href="http://localhost:5173/login">
          Already have an account? Log in.
        </a>
      </form>
    </div>
  );
};

export default Register;
