import { useNavigate, redirect } from "react-router-dom";
import Login from "../../components/login/login";
import { useEffect } from "react";
import { getAuth } from "../../util/get-auth";
import { ThemeProvider, createTheme } from "@mui/material";

const darkTheme = createTheme({
  palette: {
    mode: "dark",
  },
});

const LoginPage = () => {
  const navigate = useNavigate();
  const user = getAuth();

  useEffect(() => {
    if (user) navigate("/");
  }, [user]);

  return (
    <ThemeProvider theme={darkTheme}>
      <Login />
    </ThemeProvider>
  );
};

export default LoginPage;
