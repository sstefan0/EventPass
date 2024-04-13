import { Link, useLoaderData, useNavigate } from "react-router-dom";
import UserInfo from "../../components/user-info/user-info";
import EventsTable from "../../components/events-table/events-table";
import styles from "./dashboard.module.css";
import { useEffect, useState } from "react";
import PieChart from "../../components/statistics/statistics";
import Fab from "@mui/material/Fab";
import AddIcon from "@mui/icons-material/Add";
import Tooltip from "@mui/material/Tooltip";
import { getAuth } from "../../util/get-auth";
import callApi from "../../api/api";

interface DashboardData {
  userData: any;
  events: any;
}
export interface Statistics {
  profit: number;
  soldTickets: number;
  ticketsLeft: number;
}

const Dashboard = () => {
  const { userData, events } = useLoaderData() as DashboardData;
  const [statistics, setStatistics] = useState<Statistics>({
    profit: 0,
    soldTickets: 0,
    ticketsLeft: 0,
  });
  const [eventSelected, setEventSelected] = useState(false);
  const navigate = useNavigate();
  const role = getAuth();

  useEffect(() => {
    if (role !== "ORGANIZER") navigate("/");
  }, [role]);

  const getStatistics = async (id: string) => {
    try {
      const response = (await callApi.Event.statistics(id)) as Statistics;
      setEventSelected(true);
      setStatistics(response);
    } catch (error) {
      setStatistics({
        profit: 0,
        soldTickets: 0,
        ticketsLeft: 0,
      });
    }
  };

  return (
    <div className={styles.container}>
      <Link to="/manageEvent">
        <Tooltip title="Create new event" placement="left">
          <Fab
            color="primary"
            sx={{ position: "fixed", bottom: 16, right: 16 }}
            onClick={() => console.log("kliknuo")}
          >
            <AddIcon />
          </Fab>
        </Tooltip>
      </Link>
      <div className={styles.column}>
        <UserInfo data={userData} />
        <PieChart statistics={statistics} eventSelected={eventSelected} />
      </div>
      <EventsTable events={events} getStatistics={getStatistics} />
    </div>
  );
};

export default Dashboard;
