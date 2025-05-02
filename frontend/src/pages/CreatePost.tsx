import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Grid,
  Box,
} from "@mui/material";
import FileUpload from "../components/FileUpload";
import PostDetailsForm from "../components/PostDetailForm.tsx";
import PostActions from "../components/PostAction.tsx";

interface CreatePostProps {
  open: boolean;
  onClose: () => void;
}

const CreatePost: React.FC<CreatePostProps> = ({ open, onClose }) => {
  const [image, setImage] = useState<string | null>(null);
  const [description, setDescription] = useState<string>("");

  const handleFileUpload = (file: string) => {
    setImage(file);
  };

  const handleDescriptionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDescription(e.target.value);
  };

  const handlePostSubmit = () => {
    console.log("Post Submitted", { image, description });
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Create New Post</DialogTitle>
      <DialogContent>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <FileUpload onFileUpload={handleFileUpload} />
          </Grid>
          <Grid item xs={12}>
            <PostDetailsForm
              description={description}
              onDescriptionChange={handleDescriptionChange}
            />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <PostActions onCancel={onClose} onSubmit={handlePostSubmit} />
      </DialogActions>
    </Dialog>
  );
};

export default CreatePost;
