import { ThemeProvider, createTheme } from "@mui/material";
import "./App.css";
import AppBar from "./components/app-bar/app-bar";
import useAuth from "./hooks/useAuth";
import { jwtDecode } from "jwt-decode";
import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import { useDispatch } from "react-redux";
import { logout } from "./redux/user/user-slice";
const darkTheme = createTheme({
  palette: {
    mode: "dark",
  },
});

function App() {
  const [userData, setUserData] = useState(null);
  const dispatch = useDispatch();

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    dispatch(logout());
    setUserData(null);
  };

  const auth = useAuth();
  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (token) setUserData(jwtDecode(token));
  }, [auth]);

  return (
    <ThemeProvider theme={darkTheme}>
      <>
        <header>
          <AppBar userData={userData} onLogout={handleLogout} />
        </header>
        <main>
          <Outlet></Outlet>
        </main>
      </>
    </ThemeProvider>
  );
}

export default App;
