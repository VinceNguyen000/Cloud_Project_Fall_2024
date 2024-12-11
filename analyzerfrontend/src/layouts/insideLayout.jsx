import { Grid2 } from "@mui/material"
import ApplicationAppBar from "../containers/AppBar"
import { featureServices } from "../services/featureService"
import { useContext, useEffect, useState } from "react"
import { LoaderContext } from "../App"
import { ApplicationStepper } from "../containers/Stepper"
import Dashboard from "../containers/Dashboard"

const InsideLayout = (props) => {
    const {Component} = props

    const { setIsLoading } = useContext(LoaderContext)

    const {userData} = useContext(LoaderContext)
    console.log(setIsLoading, "setisloadin")
    console.log(userData, "userdata-data")

    const [datasetNames, setDatasetNames] = useState([])
    const [currentDatasetId, setCurrentDatasetId] = useState(null)
    const [currentDatasetName, setCurrentDatasetName] = useState(null)
    const [currentDashboardPref, setCurrentDashboardPref] = useState({})

    const getDatasetConfigs = async(dataset) => {
        setCurrentDatasetId(dataset["id"])
        setCurrentDatasetName(dataset["name"])
        setIsLoading(true)
        const response = await featureServices.getDashboardPreferences({"dataset_id": dataset["id"]})
        setCurrentDashboardPref(response.data.data)
        setIsLoading(false)
    }
    
    const getDatasetNames = async() => {
        setIsLoading(true)
        const response = await featureServices.getDatasetNames({user_id: userData.userId})
        console.log(response, "response dataset")
        setDatasetNames(response.data.data)
        if(response?.data?.data?.[0]){
            getDatasetConfigs(response.data.data[0])
        }
        setIsLoading(false)
    }

    const refreshNamesLoadDataset = async(datasetId) => {
        setIsLoading(true)
        const response = await featureServices.getDatasetNames({user_id: userData.userId})
        console.log(response, "response dataset")
        setDatasetNames(response.data.data)
        setIsLoading(false)

        const index = response.data.data.findIndex(item=> item.id == datasetId)
        if(index){
            getDatasetConfigs(response.data.data[index])
        }

    }

    useEffect(()=>{
        getDatasetNames()
    },[])

    return (
        <>
            <ApplicationAppBar datasetNames={datasetNames} getDatasetConfigs={getDatasetConfigs} getDatasetNames={getDatasetNames} refreshNamesLoadDataset={refreshNamesLoadDataset}/>
            <Grid2 sx={{ "marginTop": "64px", "marginLeft": "20px", "marginRight": "20px" }}>
                <Dashboard currentDashboardPref={currentDashboardPref} currentDatasetName={currentDatasetName} />
            </Grid2>
        </>
    )
}

export default InsideLayout