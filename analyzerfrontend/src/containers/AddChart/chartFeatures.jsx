import { TextField, Grid2 as Grid, Typography, Box } from "@mui/material"
import SelectField from "../SelectField"
import { useEffect, useState } from "react"


const ChartSpecificSelectFields = (props) => {
    const {chartType, currentChart, setCurrentChart, featureList} = props

    console.log(featureList, "feat")

    const getFeatureSelectionFields = (value) => {
        switch (value) {
            case 1:
                return (
                    <>
                    <Grid container sx={{margin: "10px"}} direction={"column"}>
                        <Grid item><Typography>Select the features to visualize on the bar chart</Typography></Grid>
                        <Grid item>
                            <Grid container direction="row" justifyContent={"space-around"}>
                                <Grid item>
                                    <SelectField
                                    options={featureList?.all_names}
                                    name={"barChartCategory"}
                                    placeholder={"Categorical Variable"}
                                    value={currentChart?.barChartCategory}
                                    handleValueChange={(e)=>setCurrentChart(e)}
                                    />
                                </Grid>
                                <Grid>
                                    <SelectField
                                    options={featureList?.integer_names}
                                    name={"barChartDependent1"}
                                    placeholder={"Dependent Variable 1"}
                                    value={currentChart?.barChartDependent1}
                                    handleValueChange={(e)=>setCurrentChart(e)}
                                    />
                                </Grid>
                                <Grid>
                                    <SelectField
                                    options={featureList?.integer_names}
                                    name={"barChartDependent2"}
                                    placeholder={"Dependent Variable 2"}
                                    value={currentChart?.barChartDependent2}
                                    handleValueChange={(e)=>setCurrentChart(e)}
                                    />
                                </Grid>
                                <Grid>
                                    <SelectField
                                    options={featureList?.integer_names}
                                    name={"barChartDependent3"}
                                    placeholder={"Dependent Variable 3"}
                                    value={currentChart?.barChartDependent3}
                                    handleValueChange={(e)=>setCurrentChart(e)}
                                    />
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>
                    </>
                )
            case 2:
                return (
                    <>
                    <Grid container sx={{margin: "10px"}} direction={"column"}>
                        <Grid item><Typography>Select the features to visualize on the Line chart</Typography></Grid>
                        <Grid item>
                            <Grid container direction="row" justifyContent={"space-around"}>
                                <Grid item>
                                    <SelectField
                                    options={featureList?.all_names}
                                    name={"lineChartCategory"}
                                    placeholder={"Categorical Variable"}
                                    value={currentChart?.lineChartCategory}
                                    handleValueChange={(e)=>setCurrentChart(e)}
                                    />
                                </Grid>
                                <Grid>
                                    <SelectField
                                    options={featureList?.integer_names}
                                    name={"lineChartDependent1"}
                                    placeholder={"Dependent Variable 1"}
                                    value={currentChart?.lineChartDependent1}
                                    handleValueChange={(e)=>setCurrentChart(e)}
                                    />
                                </Grid>
                                <Grid>
                                    <SelectField
                                    options={featureList?.integer_names}
                                    name={"lineChartDependent2"}
                                    placeholder={"Dependent Variable 2"}
                                    value={currentChart?.lineChartDependent2}
                                    handleValueChange={(e)=>setCurrentChart(e)}
                                    />
                                </Grid>
                                <Grid>
                                    <SelectField
                                    options={featureList?.integer_names}
                                    name={"lineChartDependent3"}
                                    placeholder={"Dependent Variable 3"}
                                    value={currentChart?.lineChartDependent3}
                                    handleValueChange={(e)=>setCurrentChart(e)}
                                    />
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>
                    </>
                )
        }
    }

    return (
        <>
        {getFeatureSelectionFields(chartType)}
        </>
    )
}

export default ChartSpecificSelectFields