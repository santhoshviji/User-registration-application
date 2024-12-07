import React, { useEffect, useState } from "react";
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
  Box,
  // IconButton,
  Modal,
  FormHelperText,
} from "@mui/material";
// import { Download } from "@mui/icons-material";
import { useParams, useNavigate } from "react-router-dom";
import defaultProfilePic from "../images/profile.jpg";

const EditUser = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    gender: "",
    skills: [], // ensure this is always an array
    country: "",
    dob: "",
    image: null,
    file: null,
    profilePictureUrl: null,
    supportingDocumentUrl: null,
  });

  const [errors, setErrors] = useState({});
  const [openModal, setOpenModal] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch(`http://localhost:8080/api/users/${id}`);
        if (!response.ok) throw new Error("User not found");

        const data = await response.json();
        const decodeFileName = (path) =>
          path ? decodeURIComponent(path.split("\\").pop()) : null;

        setFormData({
          name: data.name || "",
          description: data.description || "",
          gender: data.gender || "",
          skills: Array.isArray(data.skills) ? data.skills : [], // ensure skills is an array
          country: data.country || "",
          dob: data.dateOfBirth || "",
          profilePictureUrl: decodeFileName(data.profilePicturePath)
            ? `http://localhost:8080/api/users/files/${decodeFileName(data.profilePicturePath)}`
            : null,
          supportingDocumentUrl: decodeFileName(data.supportingDocumentPath)
            ? `http://localhost:8080/api/users/files/${decodeFileName(data.supportingDocumentPath)}`
            : null,
        });
      } catch (error) {
        console.error("Error fetching user:", error);
      }
    };

    fetchUser();
  }, [id]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (name === "skills") {
      // Handle checkbox changes for skills
      setFormData((prevState) => {
        const newSkills = checked
          ? [...prevState.skills, value] // Add skill
          : prevState.skills.filter((skill) => skill !== value); // Remove skill
        return {
          ...prevState,
          skills: newSkills,
        };
      });
    } else {
      // Handle regular form fields (text, radio, etc.)
      setFormData((prevState) => ({
        ...prevState,
        [name]: type === "checkbox" ? checked : value,
      }));
    }
  };

  const handleFileChange = (e) => {
    const { name } = e.target;
    const file = e.target.files[0];
    setFormData((prevState) => ({ ...prevState, [name]: file }));
  };
  const handleProfilePictureChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prevState) => ({
        ...prevState,
        image: file,
      }));
    }
  };

  const validateForm = () => {
    const formErrors = {};
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

    setErrors(formErrors);
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const formDataToSubmit = new FormData();
    formDataToSubmit.append("name", formData.name);
    formDataToSubmit.append("description", formData.description);
    formDataToSubmit.append("gender", formData.gender);
    formDataToSubmit.append("country", formData.country);
    formDataToSubmit.append("dateOfBirth", formData.dob);
    formDataToSubmit.append("skills", formData.skills.join(",")); // Convert skills to a comma-separated string
    if (formData.image) formDataToSubmit.append("profilePicture", formData.image);
    if (formData.file) formDataToSubmit.append("supportingDocument", formData.file);

    try {
      const response = await fetch(`http://localhost:8080/api/users/${id}`, {
        method: "PUT",
        body: formDataToSubmit,
      });

      if (response.ok) {
        alert("User updated successfully!");
        navigate("/table-view");
      } else {
        const errorText = await response.text();
        alert(errorText || "Error updating user");
      }
    } catch (error) {
      console.error("Error updating user:", error);
    }
  };

  return (
    <div className="edit-user-container">
      <form onSubmit={handleSubmit}>
        <h2 className="heading">Edit User</h2>
        {/* Profile Picture */}
        <Box display="flex" flexDirection="column" alignItems="center" mb={2}>
          <Box
            width={120}
            height={120}
            borderRadius="50%"
            overflow="hidden"
            bgcolor="#f0f0f0"
            onClick={() => document.getElementById("profile-picture-input").click()}
            style={{ cursor: "pointer" }}
          >
            <img
              src={
                formData.image
                  ? URL.createObjectURL(formData.image)
                  : formData.profilePictureUrl || defaultProfilePic
              }
              alt="Profile"
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          </Box>
          <input
            type="file"
            id="profile-picture-input"
            accept="image/*"
            style={{ display: "none" }}
            onChange={handleProfilePictureChange}
          />
          {formData.profilePictureUrl && (
            <Typography
              variant="body2"
              color="primary"
              style={{ cursor: "pointer", marginTop: "8px" }}
              onClick={() => setOpenModal(true)}
            >
              View Profile Picture
            </Typography>
          )}
        </Box>

        {/* Form Fields */}
        <Box display="flex" flexDirection="column" gap={2}>
          <TextField
            label="Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            fullWidth
            error={!!errors.name}
            helperText={errors.name}
          />

          <TextareaAutosize
            name="description"
            placeholder="Enter Professional Summary"
            value={formData.description}
            onChange={handleChange}
            minRows={3}
            style={{ width: "94%", padding: "8px", fontSize: "16px" }}
          />
          {errors.description && <FormHelperText error>{errors.description}</FormHelperText>}

          <Box display="flex" justifyContent="space-between" alignItems="flex-start" gap={2}>
            <Box flex={1}>
              <Typography variant="h6">Gender</Typography>
              <FormControl component="fieldset" error={Boolean(errors.gender)}>
                <RadioGroup name="gender" value={formData.gender} onChange={handleChange} row>
                  <FormControlLabel value="male" control={<Radio />} label="Male" />
                  <FormControlLabel value="female" control={<Radio />} label="Female" />
                </RadioGroup>
                {errors.gender && <FormHelperText>{errors.gender}</FormHelperText>}
              </FormControl>
            </Box>

            <Box flex={1}>
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
            <Autocomplete
              options={["India", "USA", "UK", "Australia", "Canada"]}
              value={formData.country}
              onChange={(event, newValue) => setFormData({ ...formData, country: newValue || "" })}
              renderInput={(params) => <TextField {...params} label="Country" fullWidth />}
              style={{ flex: 1 }}
            />

            <TextField
              type="date"
              label="Date of Birth"
              name="dob"
              value={formData.dob}
              onChange={handleChange}
              fullWidth
              InputLabelProps={{ shrink: true }}
              error={!!errors.dob}
              helperText={errors.dob}
              style={{ flex: 1 }}
            />
          </Box>

          {/* Supporting Document */}
          <Box mt={2}>
            <label>Supporting Document:</label>
            <input type="file" name="file" accept=".pdf,.doc,.docx" onChange={handleFileChange} />
            {formData.supportingDocumentUrl && (
              <Box display="flex" alignItems="center" mt={1}>
                <Typography
                  variant="body2"
                  color="primary"
                  style={{ cursor: "pointer" }}
                  onClick={() => window.open(formData.supportingDocumentUrl, "_blank")}
                >
                  View Supporting Document
                </Typography>
                {/* <IconButton href={formData.supportingDocumentUrl} download>
                  <Download />
                </IconButton> */}
              </Box>
            )}
          </Box>
        </Box>

        {/* Action Buttons */}
        <Box mt={2} display="flex" justifyContent="space-between">
          <Button type="submit" variant="contained" color="primary">
            Update
          </Button>
          <Button variant="outlined" color="secondary" onClick={() => navigate("/table-view")}>
            Cancel
          </Button>
        </Box>

        {/* Profile Picture Modal */}
        <Modal open={openModal} onClose={() => setOpenModal(false)}>
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              backgroundColor: "white",
              boxShadow: 24,
              padding: "16px",
              borderRadius: "8px",
            }}
          >
            <img
              src={
                formData.image
                  ? URL.createObjectURL(formData.image)
                  : formData.profilePictureUrl || defaultProfilePic
              }
              alt="Profile"
              style={{ maxWidth: "100%", maxHeight: "80vh", objectFit: "contain" }}
            />
          </Box>
        </Modal>
      </form>
    </div>
  );
};
export default EditUser;
