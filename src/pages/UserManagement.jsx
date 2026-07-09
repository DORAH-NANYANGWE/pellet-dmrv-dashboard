import { useEffect, useState } from "react";

import {
    getUsers,
    createUser
} from "../services/userService";

import {
    Box,
    Typography,
    Paper,
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
    CircularProgress,
    Alert,
    Button,
    Stack,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    MenuItem
} from "@mui/material";

import AddIcon from "@mui/icons-material/Add";

function UserManagement() {

    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [openDialog, setOpenDialog] = useState(false);

    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [role, setRole] = useState("Engineer");

    useEffect(() => {
        loadUsers();
    }, []);

    async function loadUsers() {

        try {

            setLoading(true);

            const data = await getUsers();

            setUsers(data);

        } catch (err) {

            setError(err.message);

        } finally {

            setLoading(false);

        }

    }

    async function handleCreateUser() {

    console.log("========== CREATE USER ==========");

    console.log("Button clicked");

    console.log({
        full_name: fullName,
        email: email,
        password: password,
        role: role
    });

    try {

        console.log("Calling createUser()...");

        const response = await createUser({
            full_name: fullName,
            email: email,
            password: password,
            role: role
        });

        console.log("Backend Response:", response);

        alert("User created successfully!");

        setOpenDialog(false);

        setFullName("");
        setEmail("");
        setPassword("");
        setRole("Engineer");

        await loadUsers();

    } catch (err) {

        console.error(err);

        alert(err.message);

    }

    }

    if (loading) {

        return (

            <Box
                display="flex"
                justifyContent="center"
                mt={10}
            >
                <CircularProgress />
            </Box>

        );

    }

    return (

        <Box p={4}>

            <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
                mb={3}
            >

                <Typography
                    variant="h4"
                    color="white"
                >
                    User Management
                </Typography>

                <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={() => setOpenDialog(true)}
                >
                    Add User
                </Button>

            </Stack>

            {error && (

                <Alert
                    severity="error"
                    sx={{ mb: 2 }}
                >
                    {error}
                </Alert>

            )}

            <Paper>

                <Table>

                    <TableHead>

                        <TableRow>

                            <TableCell>ID</TableCell>
                            <TableCell>Full Name</TableCell>
                            <TableCell>Email</TableCell>
                            <TableCell>Role</TableCell>

                        </TableRow>

                    </TableHead>

                    <TableBody>

                        {users.map((user) => (

                            <TableRow key={user.id}>

                                <TableCell>{user.id}</TableCell>

                                <TableCell>{user.full_name}</TableCell>

                                <TableCell>{user.email}</TableCell>

                                <TableCell>{user.role}</TableCell>

                            </TableRow>

                        ))}

                    </TableBody>

                </Table>

            </Paper>

            <Dialog
                open={openDialog}
                onClose={() => setOpenDialog(false)}
                fullWidth
                maxWidth="sm"
            >

                <DialogTitle>

                    Add New User

                </DialogTitle>

                <DialogContent>

                    <TextField
                        fullWidth
                        margin="normal"
                        label="Full Name"
                        value={fullName}
                        onChange={(e) =>
                            setFullName(e.target.value)
                        }
                    />

                    <TextField
                        fullWidth
                        margin="normal"
                        label="Email"
                        type="email"
                        value={email}
                        onChange={(e) =>
                            setEmail(e.target.value)
                        }
                    />

                    <TextField
                        fullWidth
                        margin="normal"
                        label="Password"
                        type="password"
                        value={password}
                        onChange={(e) =>
                            setPassword(e.target.value)
                        }
                    />

                    <TextField
                        select
                        fullWidth
                        margin="normal"
                        label="Role"
                        value={role}
                        onChange={(e) =>
                            setRole(e.target.value)
                        }
                    >

                        <MenuItem value="Administrator">
                            Administrator
                        </MenuItem>

                        <MenuItem value="Management">
                            Management
                        </MenuItem>

                        <MenuItem value="Engineer">
                            Engineer
                        </MenuItem>

                    </TextField>

                </DialogContent>

                <DialogActions>

                    <Button
                        onClick={() => setOpenDialog(false)}
                    >
                        Cancel
                    </Button>

                    <Button
                        variant="contained"
                        onClick={handleCreateUser}
                    >
                        Save User
                    </Button>

                </DialogActions>

            </Dialog>

        </Box>

    );


}
export default UserManagement;