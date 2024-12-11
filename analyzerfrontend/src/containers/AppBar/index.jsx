import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import ApplicationDrawer from '../Drawer';
import { useNavigate } from 'react-router-dom';
import FullScreenPopup from '../Popup';

export default function ApplicationAppBar(props) {

    const [open, setOpen] = React.useState(false);
    const [popupOpen, setPopupOpen] = React.useState(false);

    const {datasetNames, getDatasetConfigs, getDatasetNames, refreshNamesLoadDataset} = props

    return (
        <>
        <Box sx={{ flexGrow: 1 }}>
            <AppBar position="static">
                <Toolbar>
                    <IconButton
                        size="large"
                        edge="start"
                        color="inherit"
                        aria-label="menu"
                        sx={{ mr: 2 }}
                        onClick={()=>setOpen(true)}
                    >
                        <MenuIcon />
                    </IconButton>
                    <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                        CSV Data Visualization Dashboard
                    </Typography>
                </Toolbar>
            </AppBar>
        </Box>
        <ApplicationDrawer open={open} setOpen={setOpen} datasetNames={datasetNames} setPopupOpen={setPopupOpen}
        getDatasetConfigs={getDatasetConfigs} getDatasetNames={getDatasetNames} refreshNamesLoadDataset={refreshNamesLoadDataset}/>
        <FullScreenPopup popupOpen={popupOpen} setPopupOpen={setPopupOpen} getDatasetConfigs={getDatasetConfigs} refreshNamesLoadDataset={refreshNamesLoadDataset}/>
        </>
    );
}
