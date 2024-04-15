import { styled, useTheme } from "@mui/material/styles";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import styles from "./events-table.module.css";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { useNavigate } from "react-router-dom";
import {
  Alert,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  useMediaQuery,
} from "@mui/material";
import { useState } from "react";
import callApi from "../../api/api";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: "#010400",
    color: "#00F5D0",
    textAlign: "center",
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
    textAlign: "center",
  },
}));

const StyledTableRow = styled(TableRow)(() => ({
  "&:last-child td, &:last-child th": {
    border: 0,
  },
}));

const CustomizedTables = (props: any) => {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [id, setId] = useState("");
  const [displayAlert, setDisplayAlert] = useState(false);
  const [displayData, setDisplayData] = useState(props.events);
  const [index, setIndex] = useState(-1);
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("md"));

  const handleClickOpen = (title: string, id: string, index: number) => {
    setTitle(title);
    setIndex(index);
    setId(id);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  const navigate = useNavigate();

  const handleDelete = async () => {
    handleClose();
    try {
      await callApi.Event.deleteEvent(id);
      let newArray = [
        ...displayData.slice(0, index),
        ...displayData.slice(index + 1),
      ];
      setDisplayData(newArray);
      setDisplayAlert(true);
    } catch (error) {
      console.error(error);
    }
  };

  return displayData.length ? (
    <div className={styles.container}>
      <Table sx={{ minWidth: 700 }} aria-label="customized table" stickyHeader>
        <TableHead sx={{ position: "sticky", top: 0, left: 0 }}>
          <TableRow>
            <StyledTableCell align="right">Title</StyledTableCell>
            <StyledTableCell align="right">Date</StyledTableCell>
            <StyledTableCell align="right">Location</StyledTableCell>
            <StyledTableCell align="right">Edit</StyledTableCell>
            <StyledTableCell align="right">Delete</StyledTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {displayData.map((row: any, index: number) => (
            <StyledTableRow
              key={row.Id}
              onClick={() => {
                props.getStatistics(row.Id);
              }}
              hover
            >
              <StyledTableCell align="right">{row.Title}</StyledTableCell>
              <StyledTableCell align="right">
                {new Date(row.DateTime).toLocaleString()}
              </StyledTableCell>
              <StyledTableCell align="right">{row.Location}</StyledTableCell>
              <StyledTableCell
                align="right"
                onClick={() => {
                  navigate("/manageEvent/" + row.Id);
                }}
              >
                <EditIcon className={styles.editIcon} />
              </StyledTableCell>
              <StyledTableCell
                align="right"
                onClick={() => {
                  handleClickOpen(row.Title, row.Id, index);
                }}
              >
                <DeleteIcon className={styles.deleteIcon} />
              </StyledTableCell>
            </StyledTableRow>
          ))}
        </TableBody>
      </Table>
      <Dialog
        fullScreen={fullScreen}
        open={open}
        onClose={handleClose}
        PaperProps={{
          style: {
            backgroundColor: "#000000",
            borderRadius: "0px",
            borderTopLeftRadius: "20px",
            borderBottomRightRadius: "20px",
            borderBottom: "3px solid #00f5d0",
            boxShadow: "none",
          },
        }}
        aria-labelledby="responsive-dialog-title"
      >
        <DialogTitle id="responsive-dialog-title">
          {"You are about to delete " + title}
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want do delete this event?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button autoFocus onClick={handleClose}>
            Cancel
          </Button>
          <Button onClick={() => handleDelete()} color="error">
            DELETE
          </Button>
        </DialogActions>
      </Dialog>
      <Alert
        severity="error"
        variant="standard"
        sx={{
          display: displayAlert ? "flex" : "none",
          position: "absolute",
          bottom: 10,
          left: 10,
          alignSelf: "center",
        }}
        onClick={() => {
          setDisplayAlert(false);
        }}
      >
        Event deleted successfuly.
      </Alert>
    </div>
  ) : (
    <div className={styles.noDataContainer}>
      <h2>You haven't created any events.</h2>
      <a href="http://localhost:5173">Click here to create your first event!</a>
    </div>
  );
};

export const loader = async () => {
  try {
    const response = await callApi.Event.getByOrganizer();
    return response;
  } catch (error) {
    console.error(error);
  }
};

export default CustomizedTables;
