import { useState, React } from 'react';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon  from '@mui/icons-material/ArrowDownward';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import { Grid2 as Grid, TextField, Button, Box } from '@mui/material';
import SelectField from '../SelectField';
import ChartSpecificSelectFields from './chartFeatures';

export default function ApplicationSingleAccordion(props) {

    const {chartIndex, chartData, handleChartSelection, handleFeatureSelection, featureList} = props

    const chartOptions = [
        { id: 1, value: "Bar Chart" },
        { id: 2, value: "Line Chart" }
    ]

    return (
        <div>
            <Accordion defaultExpanded>
                <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel1-content"
                    id="panel1-header"
                >
                    <Typography>Add a Chart</Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <Grid
                        container
                        direction={"column"}
                    >
                        <Grid item>
                            <SelectField
                                options={chartOptions}
                                name={"chartSelect"}
                                value={chartData["chartType"]}
                                placeholder={"Select a chart type"}
                                handleValueChange={(target)=>handleChartSelection(target, chartIndex)}
                            />
                        </Grid>
                        {
                            chartData["chartType"] &&
                            <>
                                <Grid item>
                                    <ChartSpecificSelectFields chartType={chartData["chartType"]}
                                        currentChart={chartData}
                                        setCurrentChart={(target)=>handleFeatureSelection(target, chartIndex)}
                                        featureList={featureList} />
                                </Grid>
                                {/* <Grid item sx={{ margin: "10px" }}>
                                    <Box display={'flex'} justifyContent={'flex-end'}>
                                        <Button>Save</Button>
                                    </Box>
                                </Grid> */}
                            </>
                        }
                    </Grid>
                </AccordionDetails>
            </Accordion>
        </div>
    );
}