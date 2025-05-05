import { useState } from "react";
import { 
  Box, 
  Typography, 
  Button, 
  Avatar, 
  Grid
} from "@mui/material";
import PostPreview from "../components/PostPreview.tsx";
import Navbar from "../components/Navbar.tsx";
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

type Post = {
  id: number;
  image: string;
  likes: number;
};

function Profile() {

  const dummyPosts = [
    { id: 1, image: "/dummies/Post.png", likes: 23 },
    { id: 2, image: "/dummies/Post.png", likes: 45 },
    { id: 3, image: "/dummies/Post.png", likes: 15 },
    { id: 4, image: "/dummies/Post.png", likes: 7 },
    { id: 5, image: "/dummies/Post.png", likes: 19 },
    { id: 6, image: "/dummies/Post.png", likes: 31 },
    { id: 7, image: "/dummies/Post.png", likes: 5 },
    { id: 8, image: "/dummies/Post.png", likes: 12 },
    { id: 9, image: "/dummies/Post.png", likes: 2 },
  ];

  return (
    <Box
      display="flex"
      minHeight="100vh"
      sx={{
        backgroundColor: "#000",
        color: "white",
      }}
    >
        <Navbar />

        {/* Main Content Area */}
        <Box
          flex={1}
          sx={{
            ml: "275px",
            p: 4,
          }}
        >
          {/* Profile Header */}
          <Box
            display="flex"
            alignItems="center"
            justifyContent="space-between"
            sx={{ mb: 4 }}
          >
            <Avatar
              sx={{
                width: 100,
                height: 100,
                bgcolor: "#1e3c72",
              }}
            >
              U
            </Avatar>

            <Box ml={4} flex={1}>
              <Typography variant="h5" fontWeight="bold">
                Stefan Ganteng
              </Typography>
              <Typography variant="body2" color="gray">
                9 posts • 0 followers • 0 following
              </Typography>
            </Box>

            <Button
              variant="outlined"
              sx={{
                color: "white",
                borderColor: "gray",
                "&:hover": { borderColor: "white" },
              }}
            >
              Edit Profile
            </Button>
          </Box>

          {/* Posts Section */}
          <Box>
            <Typography variant="h6" gutterBottom>
              Posts
            </Typography>

            <Grid container spacing={2}>
              {dummyPosts.map((post) => (
                <Grid item xs={12} sm={6} md={4} lg={3} key={post.id}>
                  <PostPreview
                    image={post.image}
                    likes={post.likes}
                    postId={post.id.toString()} />
                </Grid>
              ))}
            </Grid>
          </Box>
        </Box>
      </Box>
    // <Dialog
    //   open={open}
    //   // setOpen(true)
    //   onClose={() => setOpen(true)}
    //   aria-labelledby="dialog-title"
    //   aria-describedby="dialog-description"
    // >
    //   <DialogTitle id="dialog-title">Testing</DialogTitle>
    //   <DialogContent>
    //     <DialogContentText id = "dialog-description">
    //       Test desc
    //       </DialogContentText>
    //   </DialogContent>
    //   <DialogActions>
    //     <Button>Cancel</Button>
    //     <Button autoFocus>Submit</Button>
    //   </DialogActions>
    // </Dialog>
  );
}

export default Profile;
