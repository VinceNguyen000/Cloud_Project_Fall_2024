import * as React from 'react';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import Button from '@mui/material/Button';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import MailIcon from '@mui/icons-material/Mail';
import AddIcon from '@mui/icons-material/Add';
import AlbumIcon from '@mui/icons-material/Album';
import { useNavigate } from 'react-router-dom';

export default function ApplicationDrawer(props) {

    const { open, setOpen, datasetNames, setPopupOpen, getDatasetConfigs } = props

    console.log(getDatasetConfigs, "getdatasetconfig")

    console.log(datasetNames, "datasetNames")

    const navigate = useNavigate()

    const DrawerList = (
        <Box sx={{ width: 250 }} role="presentation" onClick={()=>setOpen(false)}>
            <List>
                <ListItem>
                    <ListItemButton onClick={()=>setPopupOpen(true)}>
                        <ListItemIcon><AddIcon/></ListItemIcon>
                        <ListItemText primary={"Add Dataset"}/>
                    </ListItemButton>
                </ListItem>
                <Divider/>
                {datasetNames && datasetNames.map((item, index) => (
                    <ListItem key={item.id} disablePadding>
                        <ListItemButton onClick={()=>getDatasetConfigs(item)}>
                            <ListItemIcon>
                                <AlbumIcon/>
                            </ListItemIcon>
                            <ListItemText primary={item.name} />
                        </ListItemButton>
                    </ListItem>
                ))}
            </List>
        </Box>
    );

    return (
        <div>
            <Drawer open={open} onClose={()=>setOpen(false)}>
                {DrawerList}
            </Drawer>
        </div>
    );
}
