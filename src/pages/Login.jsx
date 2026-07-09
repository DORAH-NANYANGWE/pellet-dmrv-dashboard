import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { loginUser } from "../services/authService";

import {
    TextField,
    Button,
    Paper,
    Typography,
    Box,
    IconButton,
    InputAdornment,
    Alert,
    CircularProgress
} from "@mui/material";

import {
    Visibility,
    VisibilityOff
} from "@mui/icons-material";

function Login() {

    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [showPassword, setShowPassword] = useState(false);

    const [loading, setLoading] = useState(false);

    const [error, setError] = useState("");

    async function handleSubmit(e) {

        e.preventDefault();

        setError("");
        setLoading(true);

        try {

            const data = await loginUser(email, password);

            localStorage.setItem(
                "access_token",
                data.access_token
            );

            localStorage.setItem(
                "user",
                JSON.stringify(data.user)
            );

            navigate("/dashboard");

        } catch (err) {

            setError(err.message);

        } finally {

            setLoading(false);

        }

    }

    return (

        <Box
            sx={{
                height: "100vh",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                backgroundColor: "#111827"
            }}
        >

            <Paper
                elevation={8}
                sx={{
                    width: 420,
                    p: 5,
                    borderRadius: 3
                }}
            >

                <Typography
                    variant="h4"
                    align="center"
                    fontWeight="bold"
                    gutterBottom
                >
                    Pellet DMRV
                </Typography>

                <Typography
                    align="center"
                    color="text.secondary"
                    mb={4}
                >
                    Sign in to continue
                </Typography>

                {error && (

                    <Alert
                        severity="error"
                        sx={{ mb: 3 }}
                    >
                        {error}
                    </Alert>

                )}

                <form onSubmit={handleSubmit}>

                    <TextField
                        fullWidth
                        label="Email"
                        type="email"
                        margin="normal"
                        value={email}
                        onChange={(e) =>
                            setEmail(e.target.value)
                        }
                    />

                    <TextField
                        fullWidth
                        label="Password"
                        margin="normal"
                        type={
                            showPassword
                                ? "text"
                                : "password"
                        }
                        value={password}
                        onChange={(e) =>
                            setPassword(e.target.value)
                        }
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">

                                    <IconButton
                                        onClick={() =>
                                            setShowPassword(
                                                !showPassword
                                            )
                                        }
                                    >

                                        {showPassword
                                            ? <VisibilityOff />
                                            : <Visibility />}

                                    </IconButton>

                                </InputAdornment>
                            )
                        }}
                    />

                    <Button
                        fullWidth
                        variant="contained"
                        type="submit"
                        sx={{
                            mt: 3,
                            py: 1.5
                        }}
                        disabled={loading}
                    >

                        {loading ? (

                            <CircularProgress
                                size={24}
                                color="inherit"
                            />

                        ) : (

                            "Login"

                        )}

                    </Button>

                </form>

            </Paper>

        </Box>

    );

}

export default Login;