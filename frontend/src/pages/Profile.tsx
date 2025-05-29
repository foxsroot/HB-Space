import { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Button,
  Avatar,
  Grid,
  Modal,
  CircularProgress,
} from "@mui/material";
import { Link } from "react-router-dom";
import PostPreview from "../components/PostPreview";
import Navbar from "../components/Navbar.tsx";
import EditProfilePage from "./EditProfile.tsx";

type Post = {
  id: number;
  image: string;
  likes: number;
};

interface UserProfile {
  username: string;
  profilePicture?: string;
  bio?: string; // Add this field
}

function Profile() {
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [posts, setPosts] = useState<Post[]>([]);

  const handleOpenEditProfile = () => {
    setIsEditProfileOpen(true);
  };

  const handleCloseEditProfile = () => {
    setIsEditProfileOpen(false);
  };

  const handleOpenDialog = (post: Post) => {
    setSelectedPost(post);
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setSelectedPost(null);
  };

  // Fetch user data and posts
  useEffect(() => {
    const fetchUser = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/user`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (!res.ok) throw new Error("Failed to fetch user data");
        const data = await res.json();
        setUser({
          username: data.user.username,
          profilePicture: data.user.profilePicture,
          bio: data.user.bio,
        });
        // Fetch posts for this user
        const postsRes = await fetch(
          `${import.meta.env.VITE_API_BASE_URL}/posts?userId=${
            data.user.userId
          }`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (postsRes.ok) {
          const postsData = await postsRes.json();
          setPosts(
            (postsData.posts || []).map((p: any) => ({
              id: p.postId,
              image: `${import.meta.env.VITE_API_BASE_URL}/uploads/${p.image}`,
              likes: p.likesCount || 0,
            }))
          );
        } else {
          setPosts([]);
        }
      } catch (err) {
        console.error(err);
        setPosts([]);
      }
      setLoading(false);
    };

    fetchUser();
  }, [isEditProfileOpen]); // Refetch user data when the edit profile modal is closed

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh"
        sx={{ backgroundColor: "#000", color: "white" }}
      >
        <CircularProgress />
      </Box>
    );
  }

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
          <Box display="flex" flexDirection="column" alignItems="center">
            <Avatar
              sx={{
                width: 100,
                height: 100,
                bgcolor: "#1e3c72",
                mb: 2,
              }}
              src={
                user?.profilePicture
                  ? `${import.meta.env.VITE_API_BASE_URL}/uploads/${
                      user.profilePicture
                    }`
                  : "/default.png"
              }
            >
              {user?.username?.charAt(0).toUpperCase()}
            </Avatar>
          </Box>

          <Box ml={4} flex={1}>
            <Typography variant="h5" fontWeight="bold">
              {user?.username || "Unknown User"}
            </Typography>
            <Typography variant="body2" color="gray">
              9 posts • 0 followers • 0 following
            </Typography>
          </Box>

          {/* Edit Profile Button */}
          <Button
            variant="outlined"
            onClick={handleOpenEditProfile}
            sx={{
              color: "white",
              borderColor: "gray",
              "&:hover": { borderColor: "white" },
            }}
          >
            Edit Profile
          </Button>

          <Modal
            open={isEditProfileOpen}
            onClose={handleCloseEditProfile}
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              backdropFilter: "blur(5px)",
            }}
          >
            <EditProfilePage onClose={handleCloseEditProfile} />
          </Modal>
        </Box>

        {/* Bio Section */}
        <Box sx={{ textAlign: "left", mb: 4 }}>
          <Typography variant="body1" color="white">
            {user?.bio || "No bio available"} {/* Display the bio */}
          </Typography>
        </Box>

        {/* Posts Section */}
        <Box>
          <Typography variant="h6" gutterBottom>
            Posts
          </Typography>

          <Grid container spacing={2}>
            {posts.map((post) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={post.id}>
                <PostPreview
                  image={post.image}
                  likes={post.likes}
                  postId={post.id.toString()}
                />
              </Grid>
            ))}
          </Grid>
        </Box>
      </Box>
    </Box>
  );
}

export default Profile;
