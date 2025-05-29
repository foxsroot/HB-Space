import { useEffect, useState, useCallback } from "react";
import {
  Box,
  Typography,
  Grid,
  List,
  ListItem,
  ListItemAvatar,
  Avatar,
  ListItemText,
} from "@mui/material";
import PostPreview from "../components/PostPreview";
import Navbar from "../components/Navbar.tsx";
import Searchbar from "../components/Searchbar";
import PostDetailDialog from "../components/PostDetailDialog.tsx";

interface User {
  userId: string;
  username: string;
  profilePicture: string;
  fullName: string;
}

interface Post {
  postId: string;
  image: string;
  caption: string;
  userId: string;
  created_at: string;
  updated_at: string;
  likesCount: number;
  commentsCount: number;
  user: User;
}

function Explore() {
  const [searchTerm, setSearchTerm] = useState("");
  const [posts, setPosts] = useState<Post[]>([]);
  const [error, setError] = useState("");
  // const [alertActive, setAlertActive] = useState(false);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const data = await fetch(`${import.meta.env.VITE_API_BASE_URL}/posts`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        const allPost = await data.json();
        setPosts(allPost.posts);
      } catch (e) {
        setError(error);
      }
    };

    fetchPosts();
  }, []);

  const handleOpenDialog = (post: Post) => {
    setSelectedPost(post);
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setSelectedPost(null);
  };

  // Fetch user suggestions
  const handleSearch = async (term: string) => {
    setSearchLoading(true);
    try {
      const res = await fetch(
        `${
          import.meta.env.VITE_API_BASE_URL
        }/user/search?query=${encodeURIComponent(term)}`,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      if (res.ok) {
        const users = await res.json();
        setSearchResults(
          (users || []).slice(0, 5).map((u: any) => ({
            id: u.userId,
            username: u.username,
            avatarUrl: u.profilePicture
              ? `${import.meta.env.VITE_API_BASE_URL}/uploads/${
                  u.profilePicture
                }`
              : undefined,
            fullName: u.fullName,
          }))
        );
      } else {
        setSearchResults([]);
      }
    } catch {
      setSearchResults([]);
    }
    setSearchLoading(false);
  };

  return (
    <Box
      display="flex"
      minHeight="100vh"
      sx={{ backgroundColor: "#000", color: "white" }}
    >
      <Navbar />

      <Box flex={1} sx={{ ml: "275px", p: 4 }}>
        <Box mb={2} sx={{ position: "relative" }}>
          <Typography variant="h5" fontWeight="bold" gutterBottom>
            Explore
          </Typography>
          <Searchbar
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              if (e.target.value.trim()) {
                setSearchOpen(true);
                handleSearch(e.target.value);
              } else {
                setSearchOpen(false);
                setSearchResults([]);
              }
            }}
          />
          {searchOpen && searchTerm.trim() && (
            <Box
              sx={{
                position: "absolute",
                left: 0,
                top: 95, // below the searchbar (adjust if your Searchbar is taller)
                width: "100%",
                minWidth: 0,
                bgcolor: "#181818",
                color: "white",
                borderRadius: 2,
                boxShadow: 3,
                maxHeight: 325,
                overflowY: "auto",
                zIndex: 20,
              }}
            >
              <List sx={{ p: 0 }}>
                {searchLoading ? (
                  <Typography color="gray" textAlign="center" py={2}>
                    Loading...
                  </Typography>
                ) : searchResults.length === 0 ? (
                  <Typography color="gray" textAlign="center" py={2}>
                    No users found.
                  </Typography>
                ) : (
                  searchResults.map((user) => (
                    <ListItem
                      key={user.id}
                      sx={{ px: 2, py: 1, borderBottom: "1px solid #222" }}
                    >
                      <ListItemAvatar>
                        <a
                          href={`/${user.username}`}
                          style={{ textDecoration: "none" }}
                          onClick={() => setSearchOpen(false)}
                        >
                          <Avatar
                            src={user.avatarUrl || "/default.png"}
                            sx={{
                              width: 40,
                              height: 40,
                              bgcolor: "#222",
                              color: "white",
                              mr: 2,
                            }}
                          >
                            {user.username[0]?.toUpperCase()}
                          </Avatar>
                        </a>
                      </ListItemAvatar>
                      <ListItemText
                        primary={
                          <a
                            href={`/${user.username}`}
                            style={{ textDecoration: "none", color: "white" }}
                            onClick={() => setSearchOpen(false)}
                          >
                            <Typography
                              variant="subtitle1"
                              sx={{ color: "white", fontWeight: 600 }}
                            >
                              {user.username}
                            </Typography>
                          </a>
                        }
                        secondary={
                          user.fullName && (
                            <Typography
                              variant="body2"
                              sx={{ color: "#aaa", fontSize: "0.95rem" }}
                            >
                              {user.fullName}
                            </Typography>
                          )
                        }
                      />
                    </ListItem>
                  ))
                )}
              </List>
            </Box>
          )}
        </Box>

        <Grid container spacing={2}>
          {posts.map((post) => (
            <Grid key={post.postId}>
              <PostPreview
                image={`${import.meta.env.VITE_API_BASE_URL}/uploads/${
                  post.image
                }`}
                likes={post.likesCount}
                postId={post.postId.toString()}
                onClick={() => handleOpenDialog(post)}
              />
            </Grid>
          ))}
        </Grid>
      </Box>
      {selectedPost && (
        <PostDetailDialog
          open={dialogOpen}
          onClose={handleCloseDialog}
          postId={selectedPost.postId}
        />
      )}

      {/* <AlertBox>{error}</AlertBox> */}
    </Box>
  );
}

export default Explore;
