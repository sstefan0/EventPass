import * as React from "react";
import Box from "@mui/material/Box";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { TextField } from "@mui/material";
import styles from "./stepper.module.css";
import Alert from "@mui/material/Alert";
import CircularProgress from "@mui/material/CircularProgress";
import CheckIcon from "@mui/icons-material/Check";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";

const steps = [
  "Select the amount of tickets",
  "Purchase details",
  "Confirm & Export",
];

export default function HorizontalLinearStepper({
  ticketId,
  title,
  description,
  price,
}: {
  ticketId: string;
  title: string;
  description: string;
  price: number;
}) {
  const [activeStep, setActiveStep] = React.useState(0);
  const [amount, setAmount] = React.useState(0);
  const [purchaseEnabled, setPurchaseEnabled] = React.useState(true);
  const [purchaseId, setPurchaseId] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);
  const [isSuccess, setIsSuccess] = React.useState(false);
  const [isError, setError] = React.useState(false);

  const isStepOptional = (step: number) => {
    return step === 6;
  };

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handlePurchase = async () => {
    console.log(ticketId);
    setIsLoading(true);
    const response = await fetch("http://localhost:3000/purchase", {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("accessToken"),
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ eventTicketId: ticketId, Amount: amount }),
      method: "POST",
    });

    if (response.ok) {
      setIsLoading(false);
      setPurchaseEnabled(false);
      const resData = await response.json();
      setPurchaseId(resData.Id);
    } else {
      setIsLoading(false);
      setError(true);
    }
  };

  const handlePdf = async () => {
    setIsLoading(true);
    const response = await fetch(
      "http://localhost:3000/purchase/pdf?id=" + purchaseId,
      {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("accessToken"),
          "Content-Type": "application/json",
        },
        method: "GET",
      }
    );
    const blob = await response.blob();

    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "example.pdf";
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    setIsLoading(false);
    setIsSuccess(true);
  };
  const showActiveStep = (active: number) => {
    switch (active) {
      case 0:
        return (
          <div className={styles.stepContainer}>
            <TextField
              type="number"
              variant="outlined"
              label="Amount"
              onChange={(e) => setAmount(Number(e.target.value))}
              sx={{ position: "absolute", top: "50%" }}
            />
          </div>
        );
      case 1:
        return (
          <div className={styles.confirmContainer}>
            <h3>{title}</h3>
            <h4>{description}</h4>
            <h4>Amount: {amount}</h4>
            <h3>Price: {price * amount} KM</h3>
          </div>
        );
      case 2:
        return (
          <div className={styles.confirmContainer}>
            <h3>{title}</h3>
            <h4>{description}</h4>
            <h4>Amount: {amount}</h4>
            <h3>Price: {price * amount} KM</h3>
            {purchaseEnabled ? (
              <>
                <Button
                  type="button"
                  variant="contained"
                  fullWidth
                  color="primary"
                  onClick={handlePurchase}
                  disabled={isLoading || isError}
                >
                  Buy
                </Button>
                {isLoading && <CircularProgress sx={{ alignSelf: "center" }} />}
                {isError && (
                  <Typography color={"red"}>
                    <span className={styles.info}>
                      <ErrorOutlineIcon />
                      An error occured, please try again.
                    </span>
                  </Typography>
                )}
              </>
            ) : (
              <>
                {isSuccess ? (
                  <Button type="button" color="success">
                    <CheckIcon />
                  </Button>
                ) : (
                  <Button
                    type="button"
                    variant="contained"
                    fullWidth
                    color="info"
                    onClick={handlePdf}
                  >
                    {isLoading ? (
                      <CircularProgress color="success" size={24} />
                    ) : (
                      "Export as PDF"
                    )}
                  </Button>
                )}

                <Alert severity="success" variant="outlined">
                  Tickets purchased. Check your email for more info.
                </Alert>
              </>
            )}
          </div>
        );
    }
  };

  return (
    <Box
      sx={{
        width: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
      }}
    >
      <Stepper activeStep={activeStep} sx={{ height: "100%" }}>
        {steps.map((label, index) => {
          const stepProps: { completed?: boolean } = {};
          const labelProps: {
            optional?: React.ReactNode;
          } = {};
          if (isStepOptional(index)) {
            labelProps.optional = (
              <Typography variant="caption">Optional</Typography>
            );
          }

          return (
            <Step key={label} {...stepProps}>
              <StepLabel {...labelProps}>{label}</StepLabel>
            </Step>
          );
        })}
      </Stepper>
      {activeStep === steps.length ? (
        ""
      ) : (
        <React.Fragment>
          {/* OVDJE UBACITI KORAKE */}
          {showActiveStep(activeStep)}
          <Box sx={{ display: "flex", flexDirection: "row", pt: 2 }}>
            <Button
              color="inherit"
              disabled={activeStep === 0}
              onClick={handleBack}
              sx={{ mr: 1, position: "absolute", bottom: 5, left: 5 }}
            >
              Back
            </Button>
            <Box sx={{ flex: "1 1 auto" }} />

            {activeStep < steps.length - 1 && (
              <Button
                onClick={handleNext}
                sx={{ position: "absolute", bottom: 5, right: 5 }}
              >
                Next
              </Button>
            )}
          </Box>
        </React.Fragment>
      )}
    </Box>
  );
}
