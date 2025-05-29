import React, { useEffect, useState } from "react";
import { Box, Typography, Button, TextField, CircularProgress, Alert } from "@mui/material";

interface EditProfilePageProps {
    onClose: () => void;
}

interface UserProfile {
    username: string;
    email: string;
    fullName?: string;
    bio?: string;
    country?: string;
    birthdate?: string;
    profilePicture?: string;
    profilePictureFile?: File; // <-- Add this line
}

const EditProfilePage: React.FC<EditProfilePageProps> = ({ onClose }) => {
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [form, setForm] = useState<UserProfile>({ username: "", email: "" });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    useEffect(() => {
        const fetchProfile = async () => {
            setLoading(true);
            setError(null);
            try {
                const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/user`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                });
                if (!res.ok) throw new Error("Failed to fetch profile");
                const data = await res.json();
                setProfile(data.user);
                setForm({
                    username: data.user.username || "",
                    email: data.user.email || "",
                    fullName: data.user.fullName || "",
                    bio: data.user.bio || "",
                    country: data.user.country || "",
                    birthdate: data.user.birthdate || "",
                    profilePicture: data.user.profilePicture || "",
                });
            } catch (err: any) {
                setError(err.message || "Error fetching profile");
            }
            setLoading(false);
        };
        fetchProfile();
    }, []);

    // Handle form changes
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    // Handle save
    const handleSave = async () => {
        setSaving(true);
        setError(null);
        setSuccess(null);

        const formData = new FormData();
        formData.append("fullName", form.fullName || "");
        formData.append("bio", form.bio || "");
        formData.append("country", form.country || "");
        formData.append("birthdate", form.birthdate || "");
        if (form.profilePictureFile) {
            formData.append("image", form.profilePictureFile);
        }

        try {
            const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/user`, {
                method: "PUT",
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
                body: formData,
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message || "Failed to update profile");
            setSuccess("Profile updated successfully!");
            setProfile(data.user);
        } catch (err: any) {
            setError(err.message || "Error updating profile");
        }
        setSaving(false);
    };

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Box
            sx={{
                height: "100vh",
                width: "100vw",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                bgcolor: "rgba(30,60,114,0.85)",
                position: "fixed",
                top: 0,
                left: 0,
                zIndex: 10,
            }}
        >
            <Box
                sx={{
                    width: "100%",
                    maxWidth: 700,
                    backgroundColor: "#1e3c72",
                    borderRadius: 3,
                    p: { xs: 2, sm: 4 },
                    boxShadow: 8,
                    color: "white",
                    display: "flex",
                    flexDirection: { xs: "column", md: "row" },
                    gap: 4,
                    alignItems: "stretch",
                }}
            >
                {/* Left Panel */}
                <Box
                    sx={{
                        flex: 1,
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        gap: 2,
                        borderRight: { md: "2px solid #2a5298" },
                        pr: { md: 3 },
                        mb: { xs: 3, md: 0 },
                    }}
                >
                    <Typography variant="h4" sx={{ mb: 2, textAlign: "center", fontWeight: 700 }}>
                        Edit Profile
                    </Typography>
                    {/* Avatar */}
                    <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", mb: 2 }}>
                        <Box
                            sx={{
                                width: 110,
                                height: 110,
                                borderRadius: "50%",
                                overflow: "hidden",
                                border: "4px solid #2a5298",
                                background: "#fff",
                                mb: 2,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                            }}
                        >
                            <img
                                src={
                                    form.profilePicture?.startsWith("blob:")
                                        ? form.profilePicture
                                        : form.profilePicture
                                        ? `${import.meta.env.VITE_API_BASE_URL}/uploads/${form.profilePicture}`
                                        : "/default.png"
                                }
                                alt="Profile"
                                style={{
                                    width: "100%",
                                    height: "100%",
                                    objectFit: "cover",
                                }}
                            />
                        </Box>
                    </Box>
                    <Button
                        variant="outlined"
                        component="label"
                        sx={{
                            backgroundColor: "white",
                            color: "#1e3c72",
                            borderRadius: 1,
                            width: "100%",
                            fontWeight: 600,
                            letterSpacing: 1,
                            mb: 2,
                        }}
                    >
                        {form.profilePicture ? "Change Profile Picture" : "Upload Profile Picture"}
                        <input
                            type="file"
                            accept="image/*"
                            hidden
                            onChange={async (e) => {
                                if (e.target.files && e.target.files[0]) {
                                    const file = e.target.files[0];
                                    setForm({ ...form, profilePicture: URL.createObjectURL(file), profilePictureFile: file });
                                }
                            }}
                        />
                    </Button>
                    <Button
                        variant="contained"
                        fullWidth
                        sx={{
                            backgroundColor: "#2a5298",
                            "&:hover": { backgroundColor: "#1e3c72" },
                            py: 1.5,
                            fontWeight: 700,
                            fontSize: "1.1rem",
                            mb: 1,
                        }}
                        onClick={handleSave}
                        disabled={saving}
                    >
                        {saving ? <CircularProgress size={24} color="inherit" /> : "Save Changes"}
                    </Button>
                    <Button
                        variant="outlined"
                        fullWidth
                        sx={{
                            color: "white",
                            borderColor: "white",
                            "&:hover": { borderColor: "#2a5298", color: "#2a5298", background: "#fff" },
                            py: 1.5,
                            fontWeight: 600,
                        }}
                        onClick={onClose}
                    >
                        Back
                    </Button>
                    {error && <Alert severity="error" sx={{ width: "100%", mt: 2 }}>{error}</Alert>}
                    {success && <Alert severity="success" sx={{ width: "100%", mt: 2 }}>{success}</Alert>}
                </Box>
                {/* Right Panel */}
                <Box
                    sx={{
                        flex: 1,
                        display: "flex",
                        flexDirection: "column",
                        gap: 2,
                        alignItems: "center",
                        pl: { md: 3 },
                        justifyContent: "center",
                    }}
                >
                    <TextField
                        fullWidth
                        label="Full Name"
                        name="fullName"
                        value={form.fullName || ""}
                        onChange={handleChange}
                        variant="outlined"
                        sx={{ backgroundColor: "white", borderRadius: 1 }}
                    />
                    <TextField
                        fullWidth
                        label="Bio"
                        name="bio"
                        value={form.bio || ""}
                        onChange={handleChange}
                        variant="outlined"
                        multiline
                        rows={3}
                        sx={{ backgroundColor: "white", borderRadius: 1 }}
                    />
                    <TextField
                        fullWidth
                        label="Country"
                        name="country"
                        value={form.country || ""}
                        onChange={handleChange}
                        variant="outlined"
                        sx={{ backgroundColor: "white", borderRadius: 1 }}
                    />
                    <TextField
                        fullWidth
                        label="Birthdate"
                        name="birthdate"
                        type="date"
                        value={form.birthdate || ""}
                        onChange={handleChange}
                        variant="outlined"
                        InputLabelProps={{ shrink: true }}
                        sx={{ backgroundColor: "white", borderRadius: 1 }}
                    />
                </Box>
            </Box>
        </Box>
    );
};

export default EditProfilePage;