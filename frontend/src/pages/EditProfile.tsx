import React, { useState } from "react";
// import { Box, Typography, Button, TextField, DialogContent, Grid } from "@mui/material";
import { Box, Typography, Button, TextField } from "@mui/material";
// import FileUpload from "../components/FileUpload";

interface EditProfilePageProps {
    onClose: () => void;
}

const EditProfilePage: React.FC<EditProfilePageProps> = ({ onClose }) => {
    const [activePanel] = useState< "account" >("account");
    
    // const [,setImage] = useState<string | null>(null);
    // const handleFileUpload = (file: string) => {
    //     setImage(file);
    // };

    const renderAccountDetailsPanel = () => (
        <Box
            sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: 2,
                height: "100%",
                textAlign: "center",
                width: "40vh",
            }}
        >
            <Typography variant="h5" sx={{ mb: 4, textAlign: "center" }}>
                Edit Profile
            </Typography>

            <TextField
                fullWidth
                label="Username"
                variant="outlined"
                sx={{ backgroundColor: "white", borderRadius: 1 }}
            />
            <TextField
                fullWidth
                label="Email"
                variant="outlined"
                sx={{ backgroundColor: "white", borderRadius: 1 }}
            />
            {/* <DialogContent>
                <Grid>
                    <FileUpload onFileUpload={handleFileUpload} />
                </Grid>
            </DialogContent> */}
            <Button
                variant="contained"
                fullWidth
                sx={{
                    backgroundColor: "#2a5298",
                    "&:hover": { backgroundColor: "#1e3c72" },
                    py: 1.5, // Add padding for better button height
                }}
                onClick={() => console.log("Account details saved")}
            >
                Save Changes
            </Button>

            <Button
                variant="outlined"
                fullWidth
                sx={{
                    color: "white",
                    borderColor: "gray",
                    "&:hover": { borderColor: "white" },
                    py: 1.5, // Add padding for better button height
                }}
                onClick={onClose}
            >
                Back
            </Button>
        </Box>
    );

    return (
        <Box
            sx={{
                height: "100vh",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                color: "white",
                p: 0,
            }}
        >
            <Box
                sx={{
                    width: "100%",
                    maxWidth: 400,
                    height: 500, // Set consistent height for all panels
                    backgroundColor: "#1e3c72",
                    borderRadius: 2,
                    p: 4,
                    boxShadow: 24,
                    display: "flex",
                    flexDirection: "column",
                    gap: 2,
                    color: "white",
                }}
            >
                {activePanel === "account" && renderAccountDetailsPanel()}
            </Box>
        </Box>
    );
};

export default EditProfilePage;