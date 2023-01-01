import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const baseUrl = 'http://localhost:8000/api/auth';

export default function Navbar() {

    const navigate = useNavigate();

    const handleLogOut = () => {
        axios.delete(`${baseUrl}/logout`).then((resp) => {
            console.log(resp);
            alert(resp.data.message);
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
            localStorage.removeItem('userId');
            navigate('/');
        }).catch(err => {
            if (!err.response) {
                console.log('Error: Network Error');
            } else {
                console.log(err.response);
            }
        })
    }

    return (
        <Box sx={{ flexGrow: 1 }}>
            <AppBar position="static">
                <Toolbar>
                    <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                        Movies App
                    </Typography>
                    <Button color="inherit" onClick={handleLogOut}>LogOut</Button>
                </Toolbar>
            </AppBar>
        </Box>
    );
}