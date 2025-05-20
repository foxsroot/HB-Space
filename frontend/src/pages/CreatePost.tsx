import React, { useState } from "react";
import {
  Box,
  Typography,
  Button,
  TextField,
  CircularProgress,
  Alert,
} from "@mui/material";

interface CreatePostProps {
  open: boolean;
  onClose: () => void;
}

const CreatePost: React.FC<CreatePostProps> = ({ open, onClose }) => {
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [description, setDescription] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        setError("Only image files are allowed.");
        return;
      }
      setImage(file);
      setPreview(URL.createObjectURL(file)); // Show a preview of the uploaded image
      setError(null); // Clear any previous error
    }
  };

  const handleDescriptionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDescription(e.target.value);
  };

  const handlePostSubmit = async () => {
    if (!image || !description) {
      setError("Image and description are required.");
      return;
    }

    setLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append("image", image);
    formData.append("caption", description);

    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/posts`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: formData,
      });

      if (!res.ok) {
        throw new Error("Failed to create post");
      }

      const data = await res.json();
      setSuccess("Post created successfully!");
      console.log("Post created successfully:", data);
      onClose(); // Close the dialog after successful submission
    } catch (err: any) {
      console.error(err);
      setError(err.message || "An error occurred while creating the post.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        height: "100vh",
        width: "100vw",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        bgcolor: "rgba(30,60,114,0.85)",
        position: "fixed",
        top: 0,
        left: 0,
        zIndex: 10,
      }}
    >
      <Box
        sx={{
          width: "100%",
          maxWidth: 800,
          backgroundColor: "#1e3c72",
          borderRadius: 3,
          p: { xs: 2, sm: 4 },
          boxShadow: 8,
          color: "white",
          display: "flex",
          flexDirection: "column",
          gap: 4,
        }}
      >
        {/* Title */}
        <Typography
          variant="h4"
          sx={{ textAlign: "left", fontWeight: 700, mb: 2 }}
        >
          Create Post
        </Typography>

        {/* Panels */}
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            gap: 4,
          }}
        >
          <Box
            sx={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: 2,
            }}
          >
            <Box
              sx={{
                width: "100%",
                height: 200,
                borderRadius: "10px",
                overflow: "hidden",
                border: "2px solid #2a5298",
                background: "#fff",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {preview ? (
                <img
                  src={preview}
                  alt="Preview"
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                  }}
                />
              ) : (
                <Typography variant="body2" color="gray">
                  No image selected
                </Typography>
              )}
            </Box>
            <Button
              variant="outlined"
              component="label"
              sx={{
                backgroundColor: "white",
                color: "#1e3c72",
                borderRadius: 1,
                width: "100%",
                fontWeight: 600,
                letterSpacing: 1,
                height: 48, // Set consistent height
                marginTop: 2,
              }}
            >
              Upload Image
              <input
                type="file"
                accept="image/*"
                hidden
                onChange={handleFileUpload}
              />
            </Button>
          </Box>

          <Box
            sx={{
              flex: 2,
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              gap: 2,
            }}
          >
            <TextField
              fullWidth
              multiline
              rows={8} // Matches the height of the image preview
              placeholder="Write a caption..."
              value={description}
              onChange={handleDescriptionChange}
              variant="outlined"
              sx={{
                backgroundColor: "white",
                borderRadius: 1,
                height: "200px", // Matches the height of the image preview
              }}
            />

            {error && <Alert severity="error">{error}</Alert>}
            {success && <Alert severity="success">{success}</Alert>}

            <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 2, gap: 2 }}>
              <Button
                variant="outlined"
                onClick={onClose}
                sx={{
                  color: "white",
                  borderColor: "white",
                  "&:hover": {
                    borderColor: "#2a5298",
                    color: "#2a5298",
                    background: "#fff",
                  },
                  fontWeight: 600,
                  height: 48, // Set consistent height
                  marginTop: 0,
                }}
                disabled={loading}
              >
                Back
              </Button>
              <Button
                variant="contained"
                onClick={handlePostSubmit}
                sx={{
                  backgroundColor: "#2a5298",
                  "&:hover": { backgroundColor: "#1e3c72" },
                  fontWeight: 700,
                  fontSize: "1.1rem",
                  height: 48, // Set consistent height
                  marginTop: 0,
                }}
                disabled={loading}
              >
                {loading ? (
                  <CircularProgress size={24} color="inherit" />
                ) : (
                  "Post"
                )}
              </Button>
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default CreatePost;
