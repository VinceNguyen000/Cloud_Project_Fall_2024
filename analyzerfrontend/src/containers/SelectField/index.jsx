import * as React from 'react';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { OutlinedInput } from '@mui/material';

export default function SelectField(props) {

  const {options, name, placeholder, value, handleValueChange} = props

  return (
    <Box sx={{ minWidth: 120 }}>
        <InputLabel sx={{"margin": "10px"}}>{placeholder}</InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          name={name}
          value={value}
          input={<OutlinedInput notched={false}/>}
          onChange={(e)=>handleValueChange(e.target)}
          fullWidth
        >
            {options.map((item, index)=>{
                return <MenuItem value={item.id ? item.id: item}>{item.value ? item.value : item}</MenuItem>
            })}
        </Select>
    </Box>
  );
}
