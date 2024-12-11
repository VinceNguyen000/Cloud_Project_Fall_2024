import React, { useState } from "react";
import { Dialog, AppBar, Toolbar, IconButton, Typography, Button } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { ApplicationStepper } from "../Stepper";

function FullScreenPopup(props) {
    const { popupOpen, setPopupOpen } = props

  return (
    <div>

      {/* Fullscreen popup */}
      <Dialog fullScreen open={popupOpen} onClose={()=>setPopupOpen(false)}>
        <AppBar position="static" color="primary">
          <Toolbar>
            <Typography variant="h6" style={{ flexGrow: 1 }}>
              Create a Dashboard
            </Typography>
            <IconButton edge="end" color="inherit" onClick={()=>setPopupOpen(false)} aria-label="close">
              <CloseIcon />
            </IconButton>
          </Toolbar>
        </AppBar>

        {/* Content inside the popup */}
        <div style={{ padding: "16px" }}>
          <ApplicationStepper/>
        </div>
      </Dialog>
    </div>
  );
}

export default FullScreenPopup;
