import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import styles from "./reset-password.module.css";
import CircularProgress from "@mui/material/CircularProgress";
import Alert from "@mui/material/Alert";
import { useState } from "react";
import { useParams } from "react-router-dom";

const ResetPassword = () => {
  const [password, setPassword] = useState("");
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(false);
  const { token } = useParams();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    const response = await fetch("http://localhost:3000/auth/resetPassword", {
      method: "POST",
      headers: { "Content-type": "application/json" },
      body: JSON.stringify({ password, token }),
    });

    if (response.ok) {
      setIsLoading(false);
      setSuccess(true);
    } else {
      setIsLoading(false);
      setError(true);
    }
  };

  return (
    <div className={styles.formContainer}>
      <form onSubmit={handleSubmit} className={styles.loginForm}>
        <img src="../logo-hd.svg" alt="logo" className={styles.logoImage} />
        <TextField
          label="New password"
          variant="outlined"
          name="password"
          type="password"
          onChange={(e) => setPassword(e.target.value)}
          required
          autoFocus
          error={error}
          helperText={error ? "Password reset link invalid/expired" : ""}
        />

        <Button
          type="submit"
          fullWidth
          variant="contained"
          sx={{ mt: 3, mb: 2 }}
          color="info"
          disabled={isLoading || success}
        >
          {isLoading ? (
            <CircularProgress size={15} sx={{ alignSelf: "center" }} />
          ) : (
            "Reset password"
          )}
        </Button>

        {success && (
          <Alert severity="success" variant="filled">
            Password changed successfully.{" "}
            <a href="http://localhost:5173/login">Log in?</a>
          </Alert>
        )}
      </form>
    </div>
  );
};

export default ResetPassword;
