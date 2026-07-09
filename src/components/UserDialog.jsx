import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField,
    MenuItem
} from "@mui/material";

function UserDialog({

    open,
    onClose,
    onSave,

    fullName,
    setFullName,

    email,
    setEmail,

    password,
    setPassword,

    role,
    setRole,

    editingUser

}) {

    return (

        <Dialog
            open={open}
            onClose={onClose}
            fullWidth
            maxWidth="sm"
        >

            <DialogTitle>

                {editingUser
                    ? "Edit User"
                    : "Add New User"}

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

                {!editingUser && (

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

                )}

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

                <Button onClick={onClose}>

                    Cancel

                </Button>

                <Button
                    variant="contained"
                    onClick={onSave}
                >

                    {editingUser
                        ? "Update User"
                        : "Save User"}

                </Button>

            </DialogActions>

        </Dialog>

    );

}

export default UserDialog;