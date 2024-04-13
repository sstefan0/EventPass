import { PieChart } from "@mui/x-charts/PieChart";
import styles from "./statistics.module.css";
import { Statistics } from "../../pages/dashboard/dashboard";
import { Typography } from "@mui/material";

const data = [
  { id: 0, value: 10, label: "Sold tickets" },
  { id: 1, value: 15, label: "Tickets left" },
];

const PieActiveArc = ({
  statistics,
  eventSelected,
}: {
  statistics: Statistics;
  eventSelected: boolean;
}) => {
  return (
    <div className={styles.container}>
      {eventSelected ? (
        <PieChart
          series={[
            {
              data: [
                { id: 0, value: statistics.soldTickets, label: "Sold tickets" },
                { id: 1, value: statistics.ticketsLeft, label: "Tickets left" },
              ],
              highlightScope: { faded: "global", highlighted: "item" },
              faded: { innerRadius: 30, additionalRadius: -30, color: "gray" },
            },
          ]}
          height={200}
        />
      ) : (
        <h3>Click an event in the table to display it's statistics.</h3>
      )}
      <Typography>
        {statistics.profit ? "Total profit: " + statistics.profit + " KM" : ""}
      </Typography>
    </div>
  );
};

export default PieActiveArc;
