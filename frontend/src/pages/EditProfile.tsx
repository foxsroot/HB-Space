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
        try {
            const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/user`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
                body: JSON.stringify(form),
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
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                color: "white",
                p: 0,
            }}
        >
            <Box
                sx={{
                    width: "100%",
                    maxWidth: 400,
                    height: 500,
                    backgroundColor: "#1e3c72",
                    borderRadius: 2,
                    p: 4,
                    boxShadow: 24,
                    display: "flex",
                    flexDirection: "column",
                    gap: 2,
                    color: "white",
                }}
            >
                <Typography variant="h5" sx={{ mb: 2, textAlign: "center" }}>
                    Edit Profile
                </Typography>
                {error && <Alert severity="error">{error}</Alert>}
                {success && <Alert severity="success">{success}</Alert>}
                <TextField
                    fullWidth
                    label="Username"
                    name="username"
                    value={form.username}
                    onChange={handleChange}
                    variant="outlined"
                    sx={{ backgroundColor: "white", borderRadius: 1 }}
                />
                <TextField
                    fullWidth
                    label="Email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    variant="outlined"
                    sx={{ backgroundColor: "white", borderRadius: 1 }}
                />
                {/* Add more fields as needed */}
                <Button
                    variant="contained"
                    fullWidth
                    sx={{
                        backgroundColor: "#2a5298",
                        "&:hover": { backgroundColor: "#1e3c72" },
                        py: 1.5,
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
                        borderColor: "gray",
                        "&:hover": { borderColor: "white" },
                        py: 1.5,
                    }}
                    onClick={onClose}
                >
                    Back
                </Button>
            </Box>
        </Box>
    );
};

export default EditProfilePage;