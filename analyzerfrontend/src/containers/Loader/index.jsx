import React from "react";
import { Backdrop, CircularProgress, Typography } from "@mui/material";

function Loader({ open, message = "Loading..." }) {
  return (
    <Backdrop
      sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
      open={open}
    >
      <CircularProgress color='inherit' />
      <Typography sx={{ mt: 2, ml: 2 }}>{message}</Typography>
    </Backdrop>
  );
}

export default Loader;
