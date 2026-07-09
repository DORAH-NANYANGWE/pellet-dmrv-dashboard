import {
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Chip,
    IconButton
} from "@mui/material";

import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

function UserTable({

    users,

    onEdit,

    onDelete

}) {

    function getRoleColor(role) {

        switch (role) {

            case "Administrator":
                return "error";

            case "Management":
                return "primary";

            case "Engineer":
                return "success";

            default:
                return "default";

        }

    }

    return (

        <TableContainer component={Paper}>

            <Table>

                <TableHead>

                    <TableRow>

                        <TableCell><strong>Name</strong></TableCell>

                        <TableCell><strong>Email</strong></TableCell>

                        <TableCell><strong>Role</strong></TableCell>

                        <TableCell align="center">

                            <strong>Actions</strong>

                        </TableCell>

                    </TableRow>

                </TableHead>

                <TableBody>

                    {users.map((user) => (

                        <TableRow key={user.id}>

                            <TableCell>

                                {user.full_name}

                            </TableCell>

                            <TableCell>

                                {user.email}

                            </TableCell>

                            <TableCell>

                                <Chip
                                    label={user.role}
                                    color={getRoleColor(user.role)}
                                    size="small"
                                />

                            </TableCell>

                            <TableCell align="center">

                                <IconButton
                                    color="primary"
                                    onClick={() => onEdit(user)}
                                >

                                    <EditIcon />

                                </IconButton>

                                <IconButton
                                    color="error"
                                    onClick={() => onDelete(user)}
                                >

                                    <DeleteIcon />

                                </IconButton>

                            </TableCell>

                        </TableRow>

                    ))}

                </TableBody>

            </Table>

        </TableContainer>

    );

}

export default UserTable;