// Import necessary modules
import React, { useContext, useState } from "react";
import { TextField, Button, Box, Typography, Container } from "@mui/material";
import { authServices } from "../../services/authService";
import { useNavigate } from "react-router-dom";
import { LoaderContext } from "../../App";

const RegisterPage = () => {
    const navigate = useNavigate()
    
    const { setIsLoading } = useContext(LoaderContext)

  // State to manage input fields
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async(e) => {
    e.preventDefault();
    setIsLoading(true)
    console.log("Form Submitted:", formData);
    const response = await authServices.register(formData)
    console.log(response)
    navigate("/")
    setIsLoading(false)
  };

  return (
    <Container maxWidth="xs">
      <Box
        sx={{
          marginTop: 8,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Typography component="h1" variant="h5">
          Register
        </Typography>
        <Box
          component="form"
          onSubmit={handleSubmit}
          noValidate
          sx={{ mt: 3 }}
        >
          <TextField
            fullWidth
            margin="normal"
            label="Username"
            name="username"
            value={formData.username}
            onChange={handleChange}
            required
          />
          <TextField
            fullWidth
            margin="normal"
            label="Password"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Register
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default RegisterPage;
