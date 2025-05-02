import React from "react";
import { Button, Box } from "@mui/material";

interface PostActionsProps {
  onCancel: () => void;
  onSubmit: () => void;
}

const PostActions: React.FC<PostActionsProps> = ({ onCancel, onSubmit }) => {
  return (
    <Box
      sx={{ display: "flex", justifyContent: "space-between", width: "100%" }}
    >
      <Button onClick={onCancel} variant="outlined" color="secondary">
        Cancel
      </Button>
      <Button onClick={onSubmit} variant="contained" color="primary">
        Post
      </Button>
    </Box>
  );
};

export default PostActions;
