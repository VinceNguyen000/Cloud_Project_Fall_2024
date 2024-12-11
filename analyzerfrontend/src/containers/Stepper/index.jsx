import { useContext, useState } from 'react';
import React from 'react';
import Box from '@mui/material/Box';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepButton from '@mui/material/StepButton';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { Grid2 } from '@mui/material';
import ApplicationAccordion from '../AddChart';
import FileUpload from '../AddChart/fileUpload';
import { featureServices } from '../../services/featureService';
import { LoaderContext } from '../../App';

const steps = ['Upload a Dataset', 'Configure Charts for your Dashboard'];

function HorizontalNonLinearStepper(props) {
    const { userData, setIsLoading } = useContext(LoaderContext)

    const [activeStep, setActiveStep] = useState(0);
    const [completed, setCompleted] = useState({});

    const [newCharts, setNewCharts] = useState({})
    const [file, setFile] = useState(null);
    const [dataSetName, setDataSetName] = useState(null)
    const [datasetId, setDatasetId] = useState(null)
    const [featureList, setFeatureList] = useState({})

    const totalSteps = () => {
        return steps.length;
    };

    const completedSteps = () => {
        return Object.keys(completed).length;
    };

    const isLastStep = () => {
        return activeStep === totalSteps() - 1;
    };

    const allStepsCompleted = () => {
        return completedSteps() === totalSteps();
    };

    const handleNext = () => {
        const newActiveStep =
            isLastStep() && !allStepsCompleted()
                ? // It's the last step, but not all steps have been completed,
                // find the first step that has been completed
                steps.findIndex((step, i) => !(i in completed))
                : activeStep + 1;
        setActiveStep(newActiveStep);
    };

    const handleBack = () => {
        setActiveStep((prevActiveStep) => prevActiveStep - 1);
    };

    const handleStep = (step) => () => {
        setActiveStep(step);
    };

    const handleComplete = () => {
        if (activeStep == 0) {
            handleUpload()
        }
        else if (activeStep == 1) {
            handleChartConfigSubmission()
        }
        else {
            setCompleted({
                ...completed,
                [activeStep]: true,
            });
            handleNext();
        }
    };

    const handleReset = () => {
        setActiveStep(0);
        setCompleted({});
    };

    const handleAddCharts = () => {
        const newChartsLength = Object.keys(newCharts).length
        setNewCharts({ ...newCharts, [newChartsLength + 1]: { "chartType": null } })
    }

    const handleUpload = async () => {
        console.log(userData, "userData")
        const formData = new FormData()
        formData.append('file', file)
        formData.append('table_name', dataSetName)
        formData.append('user_id', userData?.userId)

        setIsLoading(true)
        const uploadResponse = await featureServices.uploadDataset(formData)
        setDatasetId(uploadResponse.data.dataset_id)

        const featureResponse = await featureServices.getFeatureList({ dataset_name: dataSetName })
        setFeatureList(featureResponse?.data)

        setCompleted({
            ...completed,
            [activeStep]: true,
        });
        handleNext();
        setIsLoading(false)
    }

    const handleChartConfigSubmission = async () => {
        setIsLoading(true)
        const response = await featureServices.saveDashboardPreferences({
            "dashboard_preferences": newCharts,
            "user_id": userData.userId, "dataset_id": datasetId
        })
        setCompleted({
            ...completed,
            [activeStep]: true,
        });
        setIsLoading(false)
    }

    const disableNext = () => {
        console.log(activeStep, "active", completed[activeStep], "compelte")
        if (activeStep == 0 && !completed[activeStep]) {
            return true
        }
        else if (isLastStep()) {
            return true
        }
        else {
            return false
        }
    }

    const stepCompletionButtonLabel = () => {
        switch (activeStep) {
            case 0:
                return "Upload"
            case 1:
                return "Submit"
        }
    }

    const getCurrentStepContainer = (value) => {
        switch (value) {
            case 0:
                return <FileUpload handleUpload={handleUpload}
                    file={file} setFile={setFile}
                    dataSetName={dataSetName} setDataSetName={setDataSetName} />
            case 1:
                return (
                    featureList &&
                    <>
                        <Grid2 sx={{ marginTop: "10px", minHeight: "60vh" }} container direction={"column"} spacing={2}>
                            {Object.keys(newCharts).length != 0 &&
                                <ApplicationAccordion newCharts={newCharts}
                                    setNewCharts={setNewCharts}
                                    featureList={featureList} />

                            }
                        </Grid2>
                        <Button variant={"contained"} sx={{marginTop: "10px"}} onClick={handleAddCharts}>Add Charts</Button>
                    </>
                )
        }
    }

    return (
        <Box sx={{ width: '100%' }}>
            <Stepper nonLinear activeStep={activeStep}>
                {steps.map((label, index) => (
                    <Step key={label} completed={completed[index]}>
                        <StepButton color="inherit" onClick={handleStep(index)} >
                            {label}
                        </StepButton>
                    </Step>
                ))}
            </Stepper>
            <div>
                {allStepsCompleted() ? (
                    <React.Fragment>
                        <Typography sx={{ mt: 2, mb: 1 }}>
                            All steps completed - you&apos;re finished
                        </Typography>
                        {/* <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
                            <Box sx={{ flex: '1 1 auto' }} />
                            <Button onClick={handleReset}>Reset</Button>
                        </Box> */}
                    </React.Fragment>
                ) : (
                    <React.Fragment>
                        {getCurrentStepContainer(activeStep)}
                        <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
                            <Button
                                color="inherit"
                                disabled={activeStep === 0}
                                onClick={handleBack}
                                sx={{ mr: 1 }}
                            >
                                Back
                            </Button>
                            <Box sx={{ flex: '1 1 auto' }} />
                            <Button onClick={handleNext} disabled={disableNext()} sx={{ mr: 1 }}>
                                Next
                            </Button>
                            {activeStep !== steps.length &&
                                (completed[activeStep] ? (
                                    <Typography variant="caption" sx={{ display: 'inline-block' }}>
                                        Step {activeStep + 1} already completed
                                    </Typography>
                                ) : (
                                    <Button variant={'contained'} onClick={handleComplete}>
                                        {stepCompletionButtonLabel()}
                                    </Button>
                                ))}
                        </Box>
                    </React.Fragment>
                )}
            </div>
        </Box>
    );
}

export const ApplicationStepper = HorizontalNonLinearStepper