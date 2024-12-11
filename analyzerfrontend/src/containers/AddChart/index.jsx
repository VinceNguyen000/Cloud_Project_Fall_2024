import { useState, React } from 'react';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import { Grid2 as Grid, TextField, Button, Box } from '@mui/material';
import SelectField from '../SelectField';
import ChartSpecificSelectFields from './chartFeatures';
import ApplicationSingleAccordion from './chartAccordion';

export default function ApplicationAccordion(props) {

    const {newCharts, setNewCharts, featureList} = props

    console.log(newCharts, "newCharts")

    const [selectedChart, setSelectedChart] = useState("")
    const [currentChart, setCurrentChart] = useState({})

    const handleChartSelection = (target, chartIndex) => {
        console.log(target, "param")
        setSelectedChart(target.value)
        setNewCharts({...newCharts, [chartIndex]: {...newCharts[chartIndex], "chartType": target.value}})
    }
    const handleFeatureSelection = (target, chartIndex) =>{
        setCurrentChart({...currentChart, [target.name]: target.value})
        setNewCharts({...newCharts, [chartIndex]: {...newCharts[chartIndex], [target.name]: target.value}})
    }

    return (
        Object.keys(newCharts).map((item, index)=>(
            <ApplicationSingleAccordion chartIndex={item}
            chartData={newCharts[item]}
            handleChartSelection={handleChartSelection}
            handleFeatureSelection={handleFeatureSelection}
            featureList={featureList}
            />
        ))
    );
}
