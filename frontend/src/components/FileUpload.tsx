import React from "react";
import { Button, Typography, Box } from "@mui/material";

interface FileUploadProps {
  onFileUpload: (file: string) => void;
}

const FileUpload: React.FC<FileUploadProps> = ({ onFileUpload }) => {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onFileUpload(URL.createObjectURL(file)); // Or use the file directly if you need to upload to a server
    }
  };

  return (
    <Box>
      <input
        accept="image/*"
        style={{ display: "none" }}
        id="file-upload"
        type="file"
        onChange={handleFileChange}
      />
      <label htmlFor="file-upload">
        <Button variant="contained" component="span" fullWidth>
          Upload Image / Video
        </Button>
      </label>
      <Typography
        variant="body2"
        align="center"
        color="textSecondary"
        marginTop={1}
      >
      </Typography>
    </Box>
  );
};

export default FileUpload;
