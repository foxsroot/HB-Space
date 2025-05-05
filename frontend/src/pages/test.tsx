import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import ListItemText from '@mui/material/ListItemText';
import ListItemButton from '@mui/material/ListItemButton';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import CloseIcon from '@mui/icons-material/Close';
import Slide from '@mui/material/Slide';
import { TransitionProps } from '@mui/material/transitions';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { styled } from '@mui/material';

const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1,
});


const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<unknown>;
  },
  ref: React.Ref<unknown>,
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function FullScreenDialog() {
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <React.Fragment>
      <Button variant="outlined" onClick={handleClickOpen}>
        Open full-screen dialog
      </Button>
    <Button
        component="label"
        role={undefined}
        variant="contained"
        tabIndex={-1}
        startIcon={<CloudUploadIcon />}
    >
        Upload files
        <VisuallyHiddenInput
        type="file"
        onChange={(event: { target: { files: any; }; }) => console.log(event.target.files)}
        multiple
        />
    </Button>
      <Dialog
        fullScreen
        open={open}
        onClose={handleClose}
        TransitionComponent={Transition}
      >
        <AppBar sx={{ position: 'relative' }}>
          <Toolbar>
            <IconButton
              edge="start"
              color="inherit"
              onClick={handleClose}
              aria-label="close"
            >
              <CloseIcon />
            </IconButton>
            <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
              Upload Image/Videos
            </Typography>
            <Button autoFocus color="inherit" onClick={handleClose}>
              upload
            </Button>
          </Toolbar>
        </AppBar>
        <List>
          <ListItemButton>
            <ListItemText primary="Select File" secondary="D:/" />
          </ListItemButton>
          <Divider />
          <ListItemButton>
            <ListItemText primary="Edit Title" secondary="Hello World!" />
          </ListItemButton>
          <ListItemButton>
            <ListItemText
              primary="Edit Description"
              secondary="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque fermentum sollicitudin tempor. Ut luctus mollis vestibulum. Morbi nec nisl vulputate, tempus nulla id, tincidunt lectus. Mauris dictum pellentesque quam, vel consectetur augue laoreet a. Integer efficitur congue purus, sit amet egestas ipsum fringilla luctus. Aenean nec porttitor ipsum."
            />
          </ListItemButton>
        </List>
      </Dialog>
    </React.Fragment>
  );
}
