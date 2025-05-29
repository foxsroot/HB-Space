import { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Button,
  Avatar,
  CircularProgress,
  Modal,
} from "@mui/material";
import { useParams } from "react-router-dom";
import Grid from "@mui/material/Grid";

import PostPreview from "../components/PostPreview";
import Navbar from "../components/Navbar.tsx";
import EditProfilePage from "./EditProfile.tsx";
import UserListDialog from "../components/UserList";
import PostDetailDialog from "../components/PostDetailDialog";
import { useUserContext } from "../contexts/UserContext";

type Post = {
  id: number;
  image: string;
  likes: number;
};

interface UserProfile {
  userId: string;
  username: string;
  fullName?: string;
  profilePicture?: string;
  bio?: string;
  postCount?: number;
  followerCount?: number;
  followingCount?: number;
}

function Profile() {
  const { username } = useParams<{ username: string }>();
  const { currentUser } = useUserContext();
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [posts, setPosts] = useState<Post[]>([]);
  const [isFollowing, setIsFollowing] = useState<boolean | null>(null);
  const [followersOpen, setFollowersOpen] = useState(false);
  const [followingsOpen, setFollowingsOpen] = useState(false);
  const [followers, setFollowers] = useState<any[]>([]);
  const [followings, setFollowings] = useState<any[]>([]);
  const [followersLoading, setFollowersLoading] = useState(false);
  const [selectedPostId, setSelectedPostId] = useState<string | null>(null);
  const [postDialogOpen, setPostDialogOpen] = useState(false);

  const handleOpenEditProfile = () => {
    setIsEditProfileOpen(true);
  };

  const handleCloseEditProfile = () => {
    setIsEditProfileOpen(false);
  };

  // Fetch user data and posts (and isFollowing)
  useEffect(() => {
    const fetchUser = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(
          `${import.meta.env.VITE_API_BASE_URL}/user/${username}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (!res.ok) throw new Error("Failed to fetch user data");
        const data = await res.json();
        setUser({
          username: data.user.username,
          profilePicture: data.user.profilePicture,
          fullName: data.user.fullName,
          bio: data.user.bio,
          postCount: data.user.postCount,
          followerCount: data.user.followerCount,
          followingCount: data.user.followingCount,
          userId: data.user.userId,
        });
        setPosts(
          (data.user.posts || []).map((p: any) => ({
            id: p.postId,
            image: `${import.meta.env.VITE_API_BASE_URL}/uploads/${p.image}`,
            likes: p.likesCount || 0,
          }))
        );
        // Use isFollowing from backend
        if (typeof data.user.isFollowing === "boolean") {
          setIsFollowing(data.user.isFollowing);
        } else {
          setIsFollowing(null);
        }
      } catch (err) {
        console.error(err);
        setPosts([]);
        setIsFollowing(null);
      }
      setLoading(false);
    };
    if (username) fetchUser();
  }, [isEditProfileOpen, username]);

  console.log("User data:", user);

  const handleFollowToggle = async () => {
    if (!user || !currentUser) return;
    const method = isFollowing ? "DELETE" : "POST";
    const url = `${import.meta.env.VITE_API_BASE_URL}/user/${
      user.userId
    }/followers`;
    try {
      console.log("URL of follow user: ", url);
      const res = await fetch(url, {
        method,
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      if (res.ok) {
        setIsFollowing((prev) => !prev);
        setUser((prev) =>
          prev
            ? {
                ...prev,
                followerCount: prev.followerCount
                  ? prev.followerCount + (isFollowing ? -1 : 1)
                  : 1,
              }
            : prev
        );
      }
    } catch (e) {
      // Optionally show error
    }
  };

  // Fetch followers
  const handleOpenFollowers = async () => {
    if (!user) return;
    setFollowersOpen(true);
    setFollowersLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/user/${user.userId}/followers`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (res.ok) {
        const data = await res.json();
        setFollowers(
          (data || []).map((u: any) => ({
            id: u.userId,
            username: u.username,
            avatarUrl: u.profilePicture
              ? `${import.meta.env.VITE_API_BASE_URL}/uploads/${
                  u.profilePicture
                }`
              : undefined,
            isFollowing: u.isFollowing,
          }))
        );
      } else {
        setFollowers([]);
      }
    } catch {
      setFollowers([]);
    }
    setFollowersLoading(false);
  };

  // Fetch followings
  const handleOpenFollowings = async () => {
    if (!user) return;
    setFollowingsOpen(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/user/${user.userId}/followings`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (res.ok) {
        const data = await res.json();
        setFollowings(
          (data || []).map((u: any) => ({
            id: u.userId,
            username: u.username,
            avatarUrl: u.profilePicture
              ? `${import.meta.env.VITE_API_BASE_URL}/uploads/${
                  u.profilePicture
                }`
              : undefined,
            isFollowing: u.isFollowing,
          }))
        );
      } else {
        setFollowings([]);
      }
    } catch {
      setFollowings([]);
    }
  };

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
            {user?.fullName && (
              <Typography
                variant="subtitle2"
                sx={{ color: "#aaa", fontSize: "0.95rem", mt: 0.5 }}
              >
                {user.fullName}
              </Typography>
            )}
            <Typography variant="body2" color="gray">
              {user?.postCount ?? 0} posts{" "}
              <span
                style={{
                  cursor: "pointer",
                  textDecoration: "underline",
                  marginLeft: 8,
                  marginRight: 8,
                }}
                onClick={handleOpenFollowers}
              >
                {user?.followerCount ?? 0} followers
              </span>
              <span
                style={{
                  cursor: "pointer",
                  textDecoration: "underline",
                  marginLeft: 8,
                }}
                onClick={handleOpenFollowings}
              >
                {user?.followingCount ?? 0} following
              </span>
            </Typography>
          </Box>

          {/* Edit Profile Button or Follow/Unfollow */}
          {currentUser && user?.userId === currentUser.userId ? (
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
          ) : (
            <Button
              variant={isFollowing ? "outlined" : "contained"}
              onClick={handleFollowToggle}
              sx={{
                color: isFollowing ? "#e52e71" : "white",
                background: isFollowing ? "transparent" : "#e52e71",
                borderColor: "#e52e71",
                textTransform: "none",
                fontWeight: 600,
                minWidth: 100,
              }}
              disabled={isFollowing === null}
            >
              {isFollowing ? "Unfollow" : "Follow"}
            </Button>
          )}

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
              <Grid key={post.id}>
                <PostPreview
                  image={post.image}
                  likes={post.likes}
                  postId={post.id.toString()}
                  onClick={() => {
                    setSelectedPostId(post.id.toString());
                    setPostDialogOpen(true);
                  }}
                />
              </Grid>
            ))}
          </Grid>
        </Box>

        <UserListDialog
          open={followersOpen}
          onClose={() => setFollowersOpen(false)}
          users={followers}
          title={followersLoading ? "Followers (Loading...)" : "Followers"}
          currentUserId={currentUser?.userId}
        />
        <UserListDialog
          open={followingsOpen}
          onClose={() => setFollowingsOpen(false)}
          users={followings}
          title={"Following"}
          currentUserId={currentUser?.userId}
        />

        {/* Post Detail Dialog */}
        {selectedPostId && (
          <PostDetailDialog
            open={postDialogOpen}
            onClose={() => setPostDialogOpen(false)}
            postId={selectedPostId}
          />
        )}
      </Box>
    </Box>
  );
}

export default Profile;
