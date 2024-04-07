import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import { useState } from "react";
import styles from "./register.module.css";
import QuestionMarkIcon from "@mui/icons-material/QuestionMark";
import MenuItem from "@mui/material/MenuItem";
import Tooltip from "@mui/material/Tooltip";
import React from "react";
import Typography from "@mui/material/Typography";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { login } from "../../redux/user/user-slice";

const Register = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [role, setRole] = useState("");
  const [emailUnavailable, setEmailUnavailable] = useState(false);

  const dispatch = useDispatch();

  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const response = await fetch("http://localhost:3000/auth/register", {
      method: "POST",
      headers: { "Content-type": "application/json" },
      body: JSON.stringify({
        firstName,
        lastName,
        email,
        phoneNumber,
        password,
        role,
      }),
    });

    if (response.ok) {
      const loginResponse = await fetch("http://localhost:3000/auth/login", {
        method: "POST",
        headers: { "Content-type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      if (loginResponse.ok) {
        const data = await loginResponse.json();
        localStorage.setItem("accessToken", data.accessToken);
        dispatch(login());
        navigate("/events");
      }
    } else if (response.status == 409) {
      setEmailUnavailable(true);
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
            onChange={(e) => setFirstName(e.target.value)}
            required
            autoFocus
          />
          <TextField
            label="Last name"
            variant="outlined"
            name="lastName"
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
          name="password"
          type="password"
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <TextField
          label="Phone number"
          variant="outlined"
          name="phoneNumber"
          type="text"
          onChange={(e) => setPhoneNumber(e.target.value)}
          required
        />
        <div className={styles.row}>
          <TextField
            label="Role"
            select
            onChange={(e) => setRole(e.target.value)}
            sx={{ width: "100%" }}
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
            <QuestionMarkIcon color="warning" sx={{}} />
          </Tooltip>
        </div>
        <Button
          type="submit"
          fullWidth
          variant="contained"
          sx={{ mt: 3, mb: 2 }}
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
