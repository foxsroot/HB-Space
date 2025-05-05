import { Box, Typography, Avatar, styled } from "@mui/material";
import { Link } from "react-router-dom";
import HomeIcon from "@mui/icons-material/Home";
import SearchIcon from "@mui/icons-material/Search";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import Button, { ButtonProps } from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import ListItemText from '@mui/material/ListItemText';
import ListItemButton from '@mui/material/ListItemButton';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import Slide from '@mui/material/Slide';
import { TransitionProps } from '@mui/material/transitions';
import React from "react";
import { blue } from "@mui/material/colors";
import CloudUploadIcon from '@mui/icons-material/CloudUpload';

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

const Navbar = () => {
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const ColorButton = styled(Button)<ButtonProps>(({ theme }) => ({
    color: theme.palette.getContrastText(blue[500]),
  }));
  
  
  return (
    <Box
      sx={{
        width: 200,
        height: "100vh",
        position: "fixed",
        top: 0,
        left: 0,
        zIndex: 1000,
        backgroundColor: "#1e3c72",
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        pl: 2,
        px: 2,
        color: "white",
      }}
    >
      <Typography variant="h5" fontWeight="bold" sx={{ mb: 4, mt: 2 }}>
        HB Space
      </Typography>

      <Box display="flex" alignItems="center" sx={{ mb: 3 }}>
        <HomeIcon sx={{ color: "white", mr: 2 }} />
        <Link to="/feed" style={{ textDecoration: "none", color: "white" }}>
          <Typography>Home</Typography>
        </Link>
      </Box>

      <Box display="flex" alignItems="center" sx={{ mb: 3 }}>
        <SearchIcon sx={{ color: "white", mr: 2 }} />
        <Link to="/search" style={{ textDecoration: "none", color: "white" }}>
          <Typography>Search</Typography>
        </Link>
      </Box>

      <Box display="flex" alignItems="center" sx={{ mb: 3 }}>
        <AddCircleOutlineIcon sx={{ color: "white", mr: 2 }} />
        <React.Fragment>
              <ColorButton 
                size="small"
                variant="outlined" 
                onClick={handleClickOpen}
              >
                Create
              </ColorButton>
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
        {/* <Link to="/create" style={{ textDecoration: "none", color: "white" }}>
          <Typography>Create</Typography>
        </Link> */}
      </Box>

      {/* Profile Link Section */}
      <Box display="flex" alignItems="center" sx={{ mt: "auto", mb: 2 }}>
        <Avatar sx={{ width: 32, height: 32, mr: 2, bgcolor: "#2a5298" }}>
          HSW
        </Avatar>
        <Link to="/profile" style={{ textDecoration: "none", color: "white" }}>
          <Typography>Profile</Typography>
        </Link>
      </Box>
    </Box>
  );
};

export default Navbar;
