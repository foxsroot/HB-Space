import React from 'react';
import {
  Dialog,
  DialogContent,
  IconButton,
  Box,
  Typography,
  Divider,
  TextField,
  List,
  ListItem,
  ListItemText,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

type Post = {
  id: number;
  image: string;
};

type PostDialogProps = {
  open: boolean;
  onClose: () => void;
  post: Post | null;
};

const PostDialog: React.FC<PostDialogProps> = ({ open, onClose, post }) => {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogContent sx={{ display: 'flex', p: 0 }}>
        {/* Left: Image */}
        <Box sx={{ width: '60%', backgroundColor: '#000' }}>
          <Box
            component="img"
            src={post?.image}
            alt="Post"
            sx={{
              width: '100%',
              height: '100%',
              objectFit: 'contain',
            }}
          />
        </Box>

        {/* Right: Comments */}
        <Box sx={{ width: '40%', p: 2, position: 'relative', backgroundColor: '#fff' }}>
          <IconButton
            onClick={onClose}
            sx={{ position: 'absolute', top: 8, right: 8 }}
          >
            <CloseIcon />
          </IconButton>

          <Typography variant="h6" gutterBottom>
            Comments
          </Typography>
          <Divider />
          <List dense sx={{ maxHeight: 300, overflowY: 'auto' }}>
            <ListItem>
              <ListItemText primary="User1" secondary="Nice post!" />
            </ListItem>
            <ListItem>
              <ListItemText primary="User2" secondary="🔥🔥🔥" />
            </ListItem>
          </List>
          <Box mt={2}>
            <TextField
              fullWidth
              variant="outlined"
              size="small"
              placeholder="Add a comment..."
            />
          </Box>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default PostDialog;
