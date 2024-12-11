import React from "react";
import { Backdrop, CircularProgress, Typography } from "@mui/material";

function Loader({ open, fullOverlay = true, message = "Loading..." }) {
  console.log(fullOverlay, "fulloverloa")
  return (
    <Backdrop
      sx={{ color: "#fff", zIndex: fullOverlay ? 1301 : 1300 }}
      open={open}
    >
      <CircularProgress color='inherit' />
      <Typography sx={{ mt: 2, ml: 2 }}>{message}</Typography>
    </Backdrop>
  );
}

export default Loader;
