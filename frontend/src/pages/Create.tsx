import React, { useState } from "react";
import { Box, Typography, Button, TextField, DialogContent, Grid } from "@mui/material";
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import FileUpload from "../components/FileUpload";

interface CreatePostPageProps {
    onClose: () => void;
}

const CreatePostPage: React.FC<CreatePostPageProps> = ({ onClose }) => {
    const [activePanel] = useState<"main">("main");

    const [,setImage] = useState<string | null>(null);
    const handleFileUpload = (file: string) => {
        setImage(file);
    };

    const renderMainPanel = () => (
        <Box
            sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "normal",
                justifyContent: "normal",
                gap: 2,
                height: "100%",
                textAlign: "center",
                width: "205vh",
            }}
        >
            <Typography variant="h4" sx={{ mb: 4, textAlign: "left" }}>
                Create a New Post
            </Typography>

            <TextField
                fullWidth
                label="Title"
                variant="outlined"
                sx={{ backgroundColor: "white", borderRadius: 1 }}
            />
            <TextField
                id="outlined-multiline-static"
                fullWidth
                label="Description"
                variant="outlined"
                multiline
                rows={5}
                sx={{ backgroundColor: "white", borderRadius: 1 }}
            />
            <DialogContent>
                <Grid>
                    <FileUpload onFileUpload={handleFileUpload} />
                </Grid>
            </DialogContent>

            <Button
                variant="contained"
                fullWidth
                startIcon={<ArrowUpwardIcon />}
                sx={{
                    backgroundColor: "#2a5298",
                    "&:hover": { backgroundColor: "#1e3c72" },
                    py: 1.5, // Add padding for better button height
                }}
            >
                Submit
            </Button>

            <Button
                variant="outlined"
                fullWidth
                sx={{
                    color: "white",
                    borderColor: "gray",
                    "&:hover": { borderColor: "white" },
                    // mt: 2,
                    py: 1.5, // Add padding for better button height
                }}
                onClick={onClose}
            >
                Close
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
                    maxWidth: 2200,
                    height: 580, // Set consistent height for all panels
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
                {activePanel === "main" && renderMainPanel()}
            </Box>
        </Box>
    );
};

export default CreatePostPage;