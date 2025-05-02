import React from "react";
import { TextField } from "@mui/material";

// Define the types for the props
interface PostDetailsFormProps {
  description: string;
  onDescriptionChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const PostDetailsForm: React.FC<PostDetailsFormProps> = ({
  description,
  onDescriptionChange,
}) => {
  return (
    <TextField
      label="Description"
      multiline
      rows={4}
      variant="outlined"
      fullWidth
      value={description}
      onChange={onDescriptionChange}
    />
  );
};

export default PostDetailsForm;
