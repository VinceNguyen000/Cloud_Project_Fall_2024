import React, { useContext, useEffect, useState } from 'react';
import { Grid2 as Grid, Paper } from '@mui/material';
import SelectField from '../SelectField';
import { featureServices } from '../../services/featureService';
import { LoaderContext } from '../../App';
import BasicLines from '../LineChart';
import BasicBars from '../BarChart';

function Dashboard(props) {
    const { userData } = useContext(LoaderContext)

    const { currentDashboardPref, currentDatasetName } = props

    console.log(userData, "userData")
    console.log(currentDashboardPref, "currentDashboardPref")

    const [datasetNames, setDatasetNames] = useState([])
    const [selectedDataset, setSelectedDataset] = useState(null)
    const [lineChartData, setLineChartData] = useState(null)
    const [barChartData, setBarChartData] = useState(null)

    // const getDatasetNames = async () => {
    //     const response = await featureServices.getDatasetNames({ user_id: userData.userId })
    //     setDatasetNames(response?.data?.dataset_names)
    // }

    

    // useEffect(() => {
    //     // getDatasetNames()
    //     getLineChartData()
    //     getBarChartData()
    // }, [])

    const handleDatasetChange = async (target) => {
        setSelectedDataset(target.value)
    }

    const getChartToRender = (mapIndex) => {
        const chartType = currentDashboardPref[mapIndex].chartType
        console.log(chartType, "chartype")
        switch (chartType) {
            case 1:
                return <BasicBars currentDatasetName={currentDatasetName}
                    barChartPreferences={currentDashboardPref[mapIndex]} />
            case 2:
                return <BasicLines currentDatasetName={currentDatasetName}
                    lineChartPreferences={currentDashboardPref[mapIndex]} />
        }
    }

    return (datasetNames && currentDashboardPref &&
        <>
            {/* <Grid container>
                <SelectField
                    options={datasetNames}
                    name={"selectDataset"}
                    placeholder={"select dataset"}
                    value={selectedDataset}
                    handleValueChange={handleDatasetChange}
                />
            </Grid> */}
            <Grid container spacing={2}>

                {Object.keys(currentDashboardPref).map((mapIndex) => (
                    <Grid item xs={12} sm={6} md={4}>
                        <Paper elevation={3}>
                            {getChartToRender(mapIndex)}
                        </Paper>
                    </Grid>
                ))}
            </Grid>


        </>
    );
}

export default Dashboard;
