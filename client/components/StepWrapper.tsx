import { Card, Grid, Step, StepLabel, Stepper } from "@mui/material";
import React from "react";

interface StepWrapperProps {
  activeStep: number;
  children: any;
}

const steps = ["Track info", "Track cover", "Upload track"];

const StepWrapper: React.FC<StepWrapperProps> = ({ activeStep, children }) => {
  return (
    <Grid
      container
      justifyContent={"center"}
      style={{ margin: "10px 0 30px", minHeight: "400px" }}
    >
      <Card className="card_transparent" style={{ width: "600px" }}>
        <Stepper
          sx={{ margin: "30px 0 10px", padding: "10px" }}
          activeStep={activeStep}
        >
          {steps.map((step, index) => (
            <Step key={index} completed={activeStep > index}>
              <StepLabel>{step}</StepLabel>
            </Step>
          ))}
        </Stepper>

        {children}
      </Card>
    </Grid>
  );
};

export default StepWrapper;
