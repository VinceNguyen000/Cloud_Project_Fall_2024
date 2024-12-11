import React, { useState } from "react";
import { Dialog, AppBar, Toolbar, IconButton, Typography, Button } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { ApplicationStepper } from "../Stepper";

function FullScreenPopup(props) {
    const { popupOpen, setPopupOpen, getDatasetConfigs, refreshNamesLoadDataset } = props
  return (
    <>
      {/* Fullscreen popup */}
      <Dialog fullWidth maxWidth={"md"} open={popupOpen} onClose={()=>setPopupOpen(false)}>
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
          <ApplicationStepper getDatasetConfigs={getDatasetConfigs} refreshNamesLoadDataset={refreshNamesLoadDataset} setPopupOpen={setPopupOpen}/>
        </div>
      </Dialog>
      </>
  );
}

export default FullScreenPopup;
