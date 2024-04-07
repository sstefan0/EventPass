import TextField from "@mui/material/TextField";
import styles from "./forgot-password.module.css";
import { useState } from "react";
import Button from "@mui/material/Button";
import Alert from "@mui/material/Alert";
import { CircularProgress } from "@mui/material";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState(false);
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    const response = await fetch("http://localhost:3000/auth/forgotPassword", {
      method: "POST",
      headers: { "Content-type": "application/json" },
      body: JSON.stringify({ email }),
    });

    if (response.ok) {
      setIsLoading(false);
      setSuccess(true);
    } else if (response.status == 404) {
      setIsLoading(false);
      setError(true);
    }
  };

  return (
    <div className={styles.formContainer}>
      <form onSubmit={handleSubmit} className={styles.loginForm}>
        <img src="./logo-hd.svg" alt="logo" className={styles.logoImage} />
        <TextField
          label="Email"
          variant="outlined"
          name="email"
          type="email"
          onChange={(e) => setEmail(e.target.value)}
          required
          autoFocus
          error={error}
          helperText={
            error
              ? "Account associated with this email addres does not exist"
              : ""
          }
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
            Check instructions sent to {email} to reset your password.
          </Alert>
        )}
      </form>
    </div>
  );
};

export default ForgotPassword;
