import React, { useState } from "react";
import {
  Autocomplete,
  Button,
  TextField,
  TextareaAutosize,
  Radio,
  RadioGroup,
  FormControlLabel,
  Checkbox,
  Typography,
  FormControl,
  FormHelperText,
  Box,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import defaultProfilePic from "../images/profile.jpg";

const RegistrationForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    gender: "",
    skills: [], // Updated: Skills array
    country: "",
    dob: "",
    image: null,
    file: null,
  });

  const navigate = useNavigate();

  const [errors, setErrors] = useState({
    name: "",
    description: "",
    gender: "",
    country: "",
    dob: "",
    image: "",
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (name === "skills") {
      // Handle multiple checkbox selection for skills
      setFormData((prevState) => {
        const updatedSkills = checked
          ? [...prevState.skills, value] // Add skill if checked
          : prevState.skills.filter((skill) => skill !== value); // Remove if unchecked
        return { ...prevState, skills: updatedSkills };
      });
    } else {
      // Handle other input fields
      setFormData({
        ...formData,
        [name]: type === "checkbox" ? checked : value,
      });
    }
  };

  const handleFileChange = (e) => {
    const { name } = e.target;
    const file = e.target.files[0];
    setFormData({
      ...formData,
      [name]: file,
    });
  };

  const validateForm = () => {
    let formErrors = {};
    let isValid = true;

    if (!formData.name) {
      formErrors.name = "Name is required";
      isValid = false;
    }

    if (!formData.description) {
      formErrors.description = "Description is required";
      isValid = false;
    }

    if (!formData.gender) {
      formErrors.gender = "Gender is required";
      isValid = false;
    }

    if (!formData.country) {
      formErrors.country = "Country is required";
      isValid = false;
    }

    if (!formData.dob) {
      formErrors.dob = "Date of Birth is required";
      isValid = false;
    }

    if (!formData.image) {
      formErrors.image = "Profile picture is required";
      isValid = false;
    }

    setErrors(formErrors);
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      const formDataToSubmit = new FormData();
      formDataToSubmit.append("name", formData.name);
      formDataToSubmit.append("description", formData.description);
      formDataToSubmit.append("gender", formData.gender);
      formDataToSubmit.append("country", formData.country);
      formDataToSubmit.append("dateOfBirth", formData.dob);
      formDataToSubmit.append("skills", formData.skills.join(",")); // Serialize skills

      if (formData.image) {
        formDataToSubmit.append("profilePicture", formData.image, formData.image.name);
      }
      if (formData.file) {
        formDataToSubmit.append("supportingDocument", formData.file, formData.file.name);
      }

      try {
        const response = await fetch("http://localhost:8080/api/users/register", {
          method: "POST",
          body: formDataToSubmit,
        });

        if (response.ok) {
          const responseData = await response.json();
          alert(responseData.message || "User registration successful!");
          navigate("/table-view");
        } else {
          const errorText = await response.text();
          alert(errorText || "Failed to register. Please try again.");
        }
      } catch (error) {
        alert("An unexpected error occurred. Please try again later.");
      }
    }
  };


  return (
    <div className="registration-container">
      <form onSubmit={handleSubmit}>
        <h2 className="heading">User Registration</h2>
        <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        marginBottom={1}
        marginTop={-2}
      >
        <Box
          width={120}
          height={120}
          borderRadius="50%"
          overflow="hidden"
          display="flex"
          justifyContent="center"
          alignItems="center"
          bgcolor="#f0f0f0"
          style={{ cursor: "pointer" }}
          onClick={() => document.getElementById("image-upload").click()}
        >
          <img
            src={
              formData.image
                ? URL.createObjectURL(formData.image)
                : defaultProfilePic
            }
            alt="Profile"
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
            }}
          />
        </Box>
        <input
          type="file"
          id="image-upload"
          name="image"
          accept="image/*"
          style={{ display: "none" }}
          onChange={handleFileChange}
        />
        <Typography variant="body2" color="textSecondary">
          {formData.image ? "Change Profile Picture" : "Add a Profile Picture"}
        </Typography>
        {errors.image && <FormHelperText error>{errors.image}</FormHelperText>}
      </Box>

      {/* Form Fields */}
      <Box display="flex" flexDirection="column" gap={2}>
        <TextField
          label="Name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          fullWidth
          required
          error={Boolean(errors.name)}
          helperText={errors.name}
        />
        <TextareaAutosize
          name="description"
          placeholder="Enter Professional Summary"
          value={formData.description}
          onChange={handleChange}
          minRows={3}
          style={{ width: "97%", padding: "8px", fontSize: "16px"}}
        />
        {errors.description && <FormHelperText error>{errors.description}</FormHelperText>}

        <Box display="flex" justifyContent="space-between" alignItems="flex-start" gap={10}>
        <box flex={1}>
          <Typography variant="h6">Gender</Typography>
        <FormControl component="fieldset" error={Boolean(errors.gender)}>
          <RadioGroup
            name="gender"
            value={formData.gender}
            onChange={handleChange}
            row
            style={{ marginTop: "1px", marginBottom: "1px" }} // Reduce margin here
          >
            <FormControlLabel value="male" control={<Radio />} label="Male" />
            <FormControlLabel value="female" control={<Radio />} label="Female" />
          </RadioGroup>
          {errors.gender && <FormHelperText>{errors.gender}</FormHelperText>}
        </FormControl>
        </box>
        

        <Box flex ={1}>
          <Typography variant="h6">Skills</Typography>
          {["Java", "C", "C++", "Python"].map((skill) => (
            <FormControlLabel
              key={skill}
              control={
                <Checkbox
                  name="skills"
                  value={skill}
                  checked={formData.skills.includes(skill)}
                  onChange={handleChange}
                />
              }
              label={skill}
            />
          ))}
        </Box>
        </Box>

        <Box display="flex" gap={2} alignItems="flex-start">
      {/* Country Autocomplete */}
      <FormControl fullWidth error={Boolean(errors.country)} style={{ flex: 1 }}>
        <Autocomplete
          options={[
            "India",
            "USA",
            "UK",
            "Australia",
            "Canada",
            "Germany",
            "France",
            "Japan",
            "China",
            "Brazil",
            "South Africa",
            "Russia",
            "Mexico",
            "Italy",
            "Spain",
            "Netherlands",
            "Sweden",
            "New Zealand",
            "Singapore",
            "Argentina",
            // Add more countries as needed
          ]}
          value={formData.country}
          onChange={(event, newValue) => {
            setFormData((prevState) => ({
              ...prevState,
              country: newValue || "",
            }));
          }}
          renderInput={(params) => (
            <TextField {...params} label="Country" placeholder="Select or type a country" />
          )}
          isOptionEqualToValue={(option, value) => option === value}
          clearOnBlur
          freeSolo
        />
        {errors.country && <FormHelperText>{errors.country}</FormHelperText>}
      </FormControl>

      {/* Date of Birth TextField */}
      <TextField
        type="date"
        label="Date of Birth"
        name="dob"
        value={formData.dob}
        onChange={handleChange}
        fullWidth
        InputLabelProps={{ shrink: true }}
        error={Boolean(errors.dob)}
        helperText={errors.dob}
        style={{ flex: 1 }}
      />
    </Box>
        <Box>
          <label>
            Supporting Documents:
            <input
              type="file"
              name="file"
              accept=".pdf,.doc,.docx"
              onChange={handleFileChange}
              style={{ marginTop: "8px", display: "block" }}
            />
          </label>
        </Box>
      </Box>

      <Button
        type="submit"
        variant="contained"
        color="primary"
        style={{ marginTop: "15px" }}
        fullWidth
      >
        Register
      </Button>
        {/* Rest of the form fields */}
      </form>
    </div>
  );
};
export default RegistrationForm;
