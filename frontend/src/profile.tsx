import { Box, Typography, Button, Avatar, Grid } from '@mui/material';
import { Link } from 'react-router-dom';
import HomeIcon from '@mui/icons-material/Home';
import SearchIcon from '@mui/icons-material/Search';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';

function Profile() {
  const dummyPosts = [
    { id: 1, image: 'https://static.wixstatic.com/media/fef3c4_40914f7a4f164abcbeff54f7bb48b328~mv2.png/v1/fit/w_924,h_520/fef3c4_40914f7a4f164abcbeff54f7bb48b328~mv2.png?fileUsed=false&quot' },
    { id: 2, image: 'https://static.wixstatic.com/media/fef3c4_40914f7a4f164abcbeff54f7bb48b328~mv2.png/v1/fit/w_924,h_520/fef3c4_40914f7a4f164abcbeff54f7bb48b328~mv2.png?fileUsed=false&quot' },
    { id: 3, image: 'https://static.wixstatic.com/media/fef3c4_40914f7a4f164abcbeff54f7bb48b328~mv2.png/v1/fit/w_924,h_520/fef3c4_40914f7a4f164abcbeff54f7bb48b328~mv2.png?fileUsed=false&quot' },
    { id: 4, image: 'https://static.wixstatic.com/media/fef3c4_40914f7a4f164abcbeff54f7bb48b328~mv2.png/v1/fit/w_924,h_520/fef3c4_40914f7a4f164abcbeff54f7bb48b328~mv2.png?fileUsed=false&quot' },
    { id: 5, image: 'https://static.wixstatic.com/media/fef3c4_40914f7a4f164abcbeff54f7bb48b328~mv2.png/v1/fit/w_924,h_520/fef3c4_40914f7a4f164abcbeff54f7bb48b328~mv2.png?fileUsed=false&quot' },
    { id: 6, image: 'https://static.wixstatic.com/media/fef3c4_40914f7a4f164abcbeff54f7bb48b328~mv2.png/v1/fit/w_924,h_520/fef3c4_40914f7a4f164abcbeff54f7bb48b328~mv2.png?fileUsed=false&quot' },
    { id: 7, image: 'https://static.wixstatic.com/media/fef3c4_40914f7a4f164abcbeff54f7bb48b328~mv2.png/v1/fit/w_924,h_520/fef3c4_40914f7a4f164abcbeff54f7bb48b328~mv2.png?fileUsed=false&quot' },
    { id: 8, image: 'https://static.wixstatic.com/media/fef3c4_40914f7a4f164abcbeff54f7bb48b328~mv2.png/v1/fit/w_924,h_520/fef3c4_40914f7a4f164abcbeff54f7bb48b328~mv2.png?fileUsed=false&quot' },
    { id: 9, image: 'https://static.wixstatic.com/media/fef3c4_40914f7a4f164abcbeff54f7bb48b328~mv2.png/v1/fit/w_924,h_520/fef3c4_40914f7a4f164abcbeff54f7bb48b328~mv2.png?fileUsed=false&quot' },
  ];

  return (
    <Box
      display="flex"
      minHeight="100vh"
      sx={{
        backgroundColor: '#000', // Black background
        color: 'white',
        m: 0,
        p: 0,
      }}
    >
      {/* Navigation Bar */}
      <Box
        sx={{
          width: 240,
          backgroundColor: '#1e3c72', // Theme primary color
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          py: 2,
          px: 3,
        }}
      >
        <Typography variant="h5" fontWeight="bold" sx={{ mb: 4, color: 'white' }}>
          HB Space
        </Typography>
        <Box display="flex" alignItems="center" sx={{ mb: 3 }}>
          <HomeIcon sx={{ color: 'white', mr: 2 }} />
          <Link to="/feed" style={{ textDecoration: 'none', color: 'white' }}>
            <Typography>Home</Typography>
          </Link>
        </Box>
        <Box display="flex" alignItems="center" sx={{ mb: 3 }}>
          <SearchIcon sx={{ color: 'white', mr: 2 }} />
          <Link to="/search" style={{ textDecoration: 'none', color: 'white' }}>
            <Typography>Search</Typography>
          </Link>
        </Box>
        <Box display="flex" alignItems="center" sx={{ mb: 3 }}>
          <AddCircleOutlineIcon sx={{ color: 'white', mr: 2 }} />
          <Link to="/create" style={{ textDecoration: 'none', color: 'white' }}>
            <Typography>Create</Typography>
          </Link>
        </Box>
        <Box display="flex" alignItems="center" sx={{ mt: 'auto' }}>
          <Avatar sx={{ width: 32, height: 32, mr: 2, bgcolor: '#2a5298' }}>HSW</Avatar>
          <Link to="/profile" style={{ textDecoration: 'none', color: 'white' }}>
            <Typography>Profile</Typography>
          </Link>
        </Box>
      </Box>

      {/* Main Content */}
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        flex={1}
        sx={{
          m: 0,
          p: 4,
        }}
      >
        {/* Profile Header */}
        <Box
          display="flex"
          alignItems="center"
          justifyContent="space-between"
          sx={{
            width: '100%',
            maxWidth: 800,
            mb: 4,
          }}
        >
          <Avatar
            sx={{
              width: 120,
              height: 120,
              bgcolor: '#1e3c72', // Theme primary color
            }}
          >
            U
          </Avatar>
          <Box flex={1} ml={4}>
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
              color: 'white',
              borderColor: 'gray',
              '&:hover': { borderColor: 'white' },
            }}
          >
            Edit Profile
          </Button>
        </Box>

        {/* Posts Section */}
        <Box
          width="100%"
          maxWidth={800}
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Typography variant="h6" gutterBottom>
            Posts
          </Typography>
          <Grid container spacing={2}>
            {dummyPosts.map((post) => (
              <Grid item xs={12} sm={6} md={4} key={post.id}>
                <Link to={`/post/${post.id}`} style={{ textDecoration: 'none' }}>
                  <Box
                    component="img"
                    src={post.image}
                    alt={`Post ${post.id}`}
                    sx={{
                      width: '250px',
                      height: '300px',
                      objectFit: 'cover',
                      borderRadius: 1,
                      cursor: 'pointer',
                    }}
                  />
                </Link>
              </Grid>
            ))}
          </Grid>
        </Box>
      </Box>
    </Box>
  );
}

export default Profile;