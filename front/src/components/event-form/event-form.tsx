import * as React from "react";
import Box from "@mui/material/Box";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { useState } from "react";
import AddEvent from "../add-event/add-event";
import AddTickets from "../add-tickets/add-tickets";
import { Link } from "react-router-dom";
import { EventData } from "../../pages/event/event-page";
import UpdateEvent from "../update-event/update-event";
import UpdateTickets from "../update-tickets/update-tickets";

const steps = ["Add event details", "Add event tickets"];

const EventForm = ({ eventData }: { eventData: EventData }) => {
  const [activeStep, setActiveStep] = useState(0);
  const [eventId, setEventId] = useState(eventData ? eventData.id : "");

  const isStepOptional = (step: number) => {
    return step === 6;
  };

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleCreationCompleted = (eventId: string) => {
    setEventId(eventId);
  };

  const showActiveStep = (active: number) => {
    switch (active) {
      case 0:
        return eventData ? (
          <UpdateEvent eventData={eventData} />
        ) : (
          <AddEvent onCreated={handleCreationCompleted} />
        );
      case 1:
        return eventData ? (
          <UpdateTickets eventId={eventId} eventData={eventData} />
        ) : (
          <AddTickets eventId={eventId} />
        );
      case 2:
    }
  };

  return (
    <Box
      sx={{
        width: "100%",
        height: "70vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        paddingBottom: "1%",
      }}
    >
      <Stepper
        activeStep={activeStep}
        sx={{
          height: "100%",
          width: "50%",
          alignSelf: "center",
          paddingTop: "0.5%",
        }}
      >
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
            <Step
              key={label}
              {...stepProps}
              sx={{
                "& .MuiStepLabel-root .Mui-completed": {
                  color: "#00F5D0", // circle color (COMPLETED)
                },
                "& .MuiStepLabel-root .Mui-active": {
                  color: "#90caf9", // circle color (ACTIVE)
                },
                paddingBottom: "1%",
              }}
            >
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
              sx={{
                mr: 1,
                position: "absolute",
                bottom: 5,
                left: 5,
                color: "#00F5D0",
                "&:hover": { color: "#00a39e" },
              }}
            >
              Back
            </Button>
            <Box sx={{ flex: "1 1 auto" }} />

            {activeStep < steps.length - 1 && (
              <Button
                onClick={handleNext}
                disabled={!eventId && !eventData}
                sx={{
                  position: "absolute",
                  bottom: 5,
                  right: 5,
                  color: "#00F5D0",
                  "&:hover": { color: "#00a39e" },
                }}
              >
                Next
              </Button>
            )}
            {activeStep === steps.length - 1 && (
              <Link to={"/event/" + eventId}>
                <Button
                  sx={{
                    position: "absolute",
                    bottom: 5,
                    right: 5,
                    color: "#00F5D0",
                    "&:hover": { color: "#00a39e" },
                  }}
                >
                  Skip
                </Button>
              </Link>
            )}
          </Box>
        </React.Fragment>
      )}
    </Box>
  );
};

export default EventForm;
