import { TextField, Button } from "@mui/material";
import styles from "./login.module.css";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { login } from "../../redux/user/user-slice";
import callApi from "../../api/api";
import { AxiosError } from "axios";
const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [wrongPassword, setWrongPassword] = useState(false);
  const [notFound, setNotFound] = useState(false);
  const navigate = useNavigate();

  const dispatch = useDispatch();

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const response = await callApi.Auth.login({ email, password });
      if (response) {
        const accessToken = response.accessToken;
        localStorage.setItem("accessToken", accessToken);
        dispatch(login({ accessToken }));

        navigate("/");
      }
    } catch (err: any) {
      if (err.response.status === 401) {
        setWrongPassword(true);
        setNotFound(false);
      } else if (err.response.status === 404) {
        setNotFound(true);
        setWrongPassword(false);
      }
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
        <a
          href="http://localhost:5173/register"
          className={notFound ? styles.recommended : ""}
        >
          Don't have an account? Register
        </a>
        <a
          href="http://localhost:5173/forgotPassword"
          className={wrongPassword ? styles.recommended : ""}
        >
          Forgot your password?
        </a>
      </form>
    </div>
  );
};

export default Login;
