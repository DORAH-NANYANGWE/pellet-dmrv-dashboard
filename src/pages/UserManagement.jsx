import { useEffect, useState } from "react";

import {
    getUsers,
    createUser,
    updateUser,
    deleteUser
} from "../services/userService";

import {
    Box,
    Typography,
    Button,
    Stack,
    CircularProgress,
    Alert
} from "@mui/material";

import AddIcon from "@mui/icons-material/Add";

import UserDialog from "../Components/UserDialog";
import UserTable from "../Components/UserTable";

function UserManagement() {

    const [users, setUsers] = useState([]);

    const [loading, setLoading] = useState(true);

    const [error, setError] = useState("");

    const [openDialog, setOpenDialog] = useState(false);

    const [editingUser, setEditingUser] = useState(null);

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

        }

        catch (err) {

            setError(err.message);

        }

        finally {

            setLoading(false);

        }

    }

    function resetForm() {

        setEditingUser(null);

        setFullName("");

        setEmail("");

        setPassword("");

        setRole("Engineer");

    }

    async function handleCreateUser() {

        try {

            await createUser({

                full_name: fullName,

                email,

                password,

                role

            });

            alert("User created successfully!");

            setOpenDialog(false);

            resetForm();

            await loadUsers();

        }

        catch (err) {

            alert(err.message);

        }

    }

    function handleEdit(user) {

        setEditingUser(user);

        setFullName(user.full_name);

        setEmail(user.email);

        setRole(user.role);

        setPassword("");

        setOpenDialog(true);

    }

    async function handleUpdateUser() {

        try {

            await updateUser(

                editingUser.id,

                {

                    full_name: fullName,

                    email,

                    role

                }

            );

            alert("User updated successfully!");

            setOpenDialog(false);

            resetForm();

            await loadUsers();

        }

        catch (err) {

            alert(err.message);

        }

    }

    async function handleDelete(user) {

    const confirmed = window.confirm(

        `Are you sure you want to delete "${user.full_name}"?`

    );

    if (!confirmed) {

        return;

    }

    try {

        await deleteUser(user.id);

        alert("User deleted successfully!");

        await loadUsers();

    }

    catch (err) {

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
                    onClick={() => {

                        resetForm();

                        setOpenDialog(true);

                    }}
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

            <UserTable

                users={users}

                onEdit={handleEdit}

                onDelete={handleDelete}

            />

            <UserDialog

                open={openDialog}

                onClose={() => {

                    setOpenDialog(false);

                    resetForm();

                }}

                onSave={

                    editingUser

                        ? handleUpdateUser

                        : handleCreateUser

                }

                fullName={fullName}
                setFullName={setFullName}

                email={email}
                setEmail={setEmail}

                password={password}
                setPassword={setPassword}

                role={role}
                setRole={setRole}

                editingUser={editingUser}

            />

        </Box>

    );

}

export default UserManagement;