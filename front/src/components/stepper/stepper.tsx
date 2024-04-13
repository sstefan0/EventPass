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
import callApi from "../../api/api";

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
  onFinish,
  availableAmount,
  onPurchase,
}: {
  ticketId: string;
  title: string;
  description: string;
  price: number;
  onFinish: React.MouseEventHandler;
  availableAmount: number;
  onPurchase: (amountPurchased: number) => void;
}) {
  const [activeStep, setActiveStep] = React.useState(0);
  const [amount, setAmount] = React.useState(0);
  const [purchaseEnabled, setPurchaseEnabled] = React.useState(true);
  const [purchaseId, setPurchaseId] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);
  const [isSuccess, setIsSuccess] = React.useState(false);
  const [isError, setError] = React.useState(false);
  const [notEnough, setNotEnough] = React.useState(false);

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
    try {
      const response = await callApi.Purchase.purchase({
        eventTicketId: ticketId,
        Amount: amount,
      });
      setIsLoading(false);
      setPurchaseEnabled(false);
      onPurchase(amount);
      setPurchaseId(response.Id);
    } catch (error) {
      setIsLoading(false);
      setError(true);
    }
  };

  const handlePdf = async () => {
    setIsLoading(true);
    try {
      const response = await callApi.Purchase.pdf(purchaseId);
      console.log(response);
      const blob = new Blob([response], { type: "application/pdf" });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `ticket_${purchaseId}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      setIsLoading(false);
      setIsSuccess(true);
    } catch (error) {
      console.error(error);
    }
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
              onChange={(e) => {
                const selectedAmount = Number(e.target.value);
                console.log(selectedAmount, availableAmount);
                if (selectedAmount > availableAmount) setNotEnough(true);
                else setNotEnough(false);
                setAmount(Number(e.target.value));
              }}
              sx={{ position: "absolute", top: "50%" }}
              helperText={notEnough ? "Not enough tickets left." : ""}
              error={notEnough}
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
                disabled={notEnough}
              >
                Next
              </Button>
            )}
            {activeStep === steps.length - 1 && (
              <Button
                onClick={onFinish}
                sx={{ position: "absolute", bottom: 5, right: 5 }}
              >
                {purchaseEnabled ? "Cancel" : "Finish"}
              </Button>
            )}
          </Box>
        </React.Fragment>
      )}
    </Box>
  );
}
