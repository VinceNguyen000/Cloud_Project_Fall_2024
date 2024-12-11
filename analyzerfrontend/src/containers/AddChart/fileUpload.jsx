import { Grid, Grid2, TextField, Typography } from "@mui/material";
import { useState } from "react";

const FileUpload = (props) => {

    const { handleUpload, file, setFile, dataSetName, setDataSetName } = props

    const handleFileChange = (event) => {
        setFile(event.target.files[0]);
    };

    const handleDrop = (event) => {
        event.preventDefault();
        setFile(event.dataTransfer.files[0]);
    };

    return (

        <div
            style={{
                border: "2px dashed gray",
                padding: "20px",
                margin: "20px auto",
                textAlign: "center",
                width: "60%",
                minHeight: "55vh"
            }}
            onDrop={handleDrop}
        >
            <Grid2 container direction={"column"}>
                <Grid2 item>
                    <Grid2 container direction={"row"} justifyContent={"space-around"}>
                        <Grid2 item>
                            <Typography sx={{marginTop: "10px"}}>Enter a name for your dataset</Typography>
                        </Grid2>
                        <Grid2 item>
                            <TextField type="text" onChange={(e) => { console.log(e.target.value); setDataSetName(e.target.value) }} />
                        </Grid2>
                    </Grid2>
                    <Grid2 container sx={{marginTop: "20px"}} spacing={2} direction={"column"}>
                        <Grid2 item>
                            <Typography>Click to choose your CSV file</Typography>
                        </Grid2>
                        <Grid2 item>
                            <input
                                type="file"
                                accept=".csv"
                                style={{ display: "none" }}
                                id="fileInput"
                                onChange={handleFileChange}
                            />
                            <label
                                htmlFor="fileInput"
                                style={{
                                    display: "inline-feature_block",
                                    padding: "10px 20px",
                                    backgroundColor: "#007BFF",
                                    color: "white",
                                    borderRadius: "5px",
                                    cursor: "pointer",
                                }}
                            >
                                Choose File
                            </label>
                            {file && (
                                <p style={{ marginTop: "10px" }}>Selected File: {file.name}</p>
                            )}
                        </Grid2>
                    </Grid2>

                </Grid2>
            </Grid2>

        </div>
    )
}

export default FileUpload