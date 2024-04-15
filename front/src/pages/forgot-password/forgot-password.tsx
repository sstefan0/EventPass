import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import ForgotPassword from "../../components/forgot-password/forgot-password";
import { getAuth } from "../../util/get-auth";
import { ThemeProvider, createTheme } from "@mui/material";

const darkTheme = createTheme({ palette: { mode: "dark" } });

const ForgotPasswordPage = () => {
  const navigate = useNavigate();
  const auth = getAuth();
  useEffect(() => {
    if (auth) navigate("/");
  }, [auth]);

  return (
    <ThemeProvider theme={darkTheme}>
      <ForgotPassword />
    </ThemeProvider>
  );
};

export default ForgotPasswordPage;
