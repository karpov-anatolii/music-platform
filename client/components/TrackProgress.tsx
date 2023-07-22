import { Box, Typography } from "@mui/material";
import React, { ChangeEventHandler } from "react";

interface TrackProgressProps {
  left: number;
  right: number;
  onChange: ChangeEventHandler<HTMLInputElement>;
}

const TrackProgress: React.FC<TrackProgressProps> = ({
  left,
  right,
  onChange,
}) => {
  return (
    <Box style={{ display: "flex", width: "100%" }}>
      <input
        style={{ width: "100%" }}
        type="range"
        min={0}
        max={right}
        value={left}
        onChange={onChange}
      />
      <Typography variant="body2" component="h5">
        {left}/{right}
      </Typography>
    </Box>
  );
};

export default TrackProgress;
