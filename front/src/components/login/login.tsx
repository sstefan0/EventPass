import { TextField, Button } from "@mui/material";
import styles from "./login.module.css";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [wrongPassword, setWrongPassword] = useState(false);
  const [notFound, setNotFound] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:3000/auth/login", {
        method: "POST",
        headers: { "Content-type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        const data = await response.json();
        const accessToken = data.accessToken;

        localStorage.setItem("accessToken", accessToken);

        navigate("/events");
      } else if (response.status === 401) {
        setWrongPassword(true);
        setNotFound(false);
      } else if (response.status === 404) {
        setNotFound(true);
        setWrongPassword(false);
      }
    } catch (err) {
      console.error("Login error", err);
    }
  };

  return (
    <div className={styles.formContainer}>
      <form onSubmit={handleLogin} className={styles.loginForm}>
        <img src="./logo-hd.svg" alt="logo" className={styles.logoImage} />
        <TextField
          label="Email"
          variant="outlined"
          name="email"
          type="email"
          onChange={(e) => setEmail(e.target.value)}
          required
          autoFocus
          error={notFound}
          helperText={notFound ? "Account with this email doesn't exist." : ""}
        />
        <TextField
          label="Password"
          variant="outlined"
          name="password"
          type="password"
          onChange={(e) => setPassword(e.target.value)}
          required
          error={wrongPassword}
          helperText={wrongPassword ? "Wrong password!" : ""}
        />
        <Button
          type="submit"
          fullWidth
          variant="contained"
          sx={{ mt: 3, mb: 2 }}
          color="info"
        >
          Sign In
        </Button>
      </form>
    </div>
  );
};

export default Login;
