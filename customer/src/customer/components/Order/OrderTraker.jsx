import React from "react";
import { Step, StepLabel, Stepper } from "@mui/material";

const steps = [
  "Placed",
  "Order Confirmed",
  "Shipped",
  "Out Of Delivery",
  "Delivered"
];

const OrderTraker = ({ activeStep }) => {
  return (
    <div className="px-2 md:px-20 py-4">
      <div className="w-full">
        <Stepper activeStep={activeStep} alternativeLabel>
          {steps.map((label, idx) => (
            <Step key={label + idx}>
              <StepLabel
                sx={{
                  color: idx <= activeStep ? "#4F46E5" : "#A0AEC0",
                  fontWeight: idx === activeStep ? 700 : 500,
                  fontSize: "1.1rem"
                }}
                StepIconProps={{
                  style: {
                    color: idx <= activeStep ? "#4F46E5" : "#A0AEC0",
                    fontSize: 32
                  }
                }}
              >
                {label}
              </StepLabel>
            </Step>
          ))}
        </Stepper>
      </div>
    </div>
  );
};

export default OrderTraker;