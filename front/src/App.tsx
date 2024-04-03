import { ThemeProvider, createTheme } from "@mui/material";
import "./App.css";
import AppBar from "./components/app-bar/app-bar";
import { Outlet } from "react-router-dom";
import useAuth from "./hooks/useAuth";
import { jwtDecode } from "jwt-decode";
import { useEffect, useState } from "react";
import EventCardList from "./components/event-card-list/event-card-list";

const darkTheme = createTheme({
  palette: {
    mode: "dark",
  },
});

function App() {
  const [userData, setUserData] = useState(null);

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    setUserData(null);
  };

  const auth = useAuth();
  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    console.log(token);
    if (token) setUserData(jwtDecode(token));
  }, [auth]);

  console.log(userData);
  return (
    <ThemeProvider theme={darkTheme}>
      <>
        <header>
          <AppBar userData={userData} onLogout={handleLogout} />
        </header>
        <main>
          <EventCardList />
        </main>
      </>
    </ThemeProvider>
  );
}

export default App;
