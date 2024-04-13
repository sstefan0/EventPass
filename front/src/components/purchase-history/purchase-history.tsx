import { styled } from "@mui/material/styles";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import styles from "./purchase-history.module.css";
import { Typography } from "@mui/material";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: "#90caf9",
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.action.hover,
  },
  // hide last border
  "&:last-child td, &:last-child th": {
    border: 0,
  },
}));

export default function CustomizedTables(props: any) {
  return props.purchases.length ? (
    <div className={styles.container}>
      <Table sx={{ minWidth: 700 }} aria-label="customized table" stickyHeader>
        <TableHead sx={{ position: "sticky", top: 0, left: 0 }}>
          <TableRow>
            <StyledTableCell align="right">Event</StyledTableCell>
            <StyledTableCell align="right">Event date</StyledTableCell>
            <StyledTableCell align="right">Ticket type</StyledTableCell>
            <StyledTableCell align="right">Amount</StyledTableCell>
            <StyledTableCell align="right">Price</StyledTableCell>
            <StyledTableCell align="right">Purchased at</StyledTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {props.purchases.map((row: any) => (
            <StyledTableRow key={row.Id}>
              <StyledTableCell align="right">{row.Event}</StyledTableCell>
              <StyledTableCell align="right">
                {new Date(row.EventDate).toLocaleString()}
              </StyledTableCell>
              <StyledTableCell align="right">{row.TicketType}</StyledTableCell>
              <StyledTableCell align="right">{row.Amount}</StyledTableCell>
              <StyledTableCell align="right">{row.Price}</StyledTableCell>
              <StyledTableCell align="right">
                {new Date(row.PurchasedAt).toLocaleString()}
              </StyledTableCell>
            </StyledTableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  ) : (
    <div className={styles.noDataContainer}>
      <h2>You do not have any purchased tickets</h2>
      <a href="http://localhost:5173">Click here to start browsing.</a>
    </div>
  );
}
