import * as React from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';


const theme = createTheme();
const baseUrl = 'http://localhost:8000/api/auth';

export default function SignIn() {
    const [user, setUser] = React.useState({
        user_email: '',
        user_password: ''
    });
    const navigate = useNavigate();

    const handleChange = (event) => {
        event.preventDefault();
        const { name, value } = event.target;
        setUser({
            ...user,
            [name]: value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log("Received request with: ", user);
        // alert("Going to send post req");
        const resp = await axios.post(`${baseUrl}/login`, user);
        console.log("Response: ", resp);
        if (!resp.data.tokens.accessToken) {
            alert('Wrong credentials');
        }
        else {
            alert('Signed in successfully');
            navigate("/home");
            localStorage.setItem('userId', resp.data.user_id);
            localStorage.setItem('accessToken', resp.data.tokens.accessToken);
            localStorage.setItem('refreshToken', resp.data.tokens.refreshToken);
            console.log("Locastorage: ", localStorage.getItem('userId'), localStorage.getItem('accessToken'), localStorage.getItem('refreshToken'));
        }
        // axios.post(`${baseUrl}/login`, user).then((response) => {
        //     console.log("Response: ", response);
        //     if(response){
        //         alert('Signed in successfully');
        //         navigate("/home");
        //         console.log('signed in');
        //     }
        //     else{
        //         alert('Invalid credentials');
        //     }

        // }).catch(err => {
        //     if (!err.response) {
        //         console.log('Error: Network Error');
        //     } else {
        //         console.log(err.response);
        //     }
        // })
    };

    return (
        <ThemeProvider theme={theme}>
            <Container component="main" maxWidth="xs">
                <Box
                    sx={{
                        marginTop: 8,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                    }}
                >
                    <Typography component="h1" variant="h5">
                        Sign in
                    </Typography>
                    <Box component="form" sx={{ mt: 1 }}>
                        <TextField
                            margin="normal"
                            fullWidth
                            id="email"
                            label="Email Address"
                            name="user_email"
                            value={user.user_email}
                            onChange={handleChange}
                        />
                        <TextField
                            margin="normal"
                            fullWidth
                            name="user_password"
                            label="Password"
                            type="password"
                            id="password"
                            value={user.user_password}
                            onChange={handleChange}
                        />
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            onClick={handleSubmit}
                            sx={{ mt: 3, mb: 2 }}
                        >
                            Sign In
                        </Button>
                        <Grid container>
                            <Grid item>
                                <Link href="register" variant="body2">
                                    {"Don't have an account? Sign Up"}
                                </Link>
                            </Grid>
                        </Grid>
                    </Box>
                </Box>
            </Container>
        </ThemeProvider>
    );
}