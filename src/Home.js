import { Autocomplete, Button, Chip, Dialog, DialogActions, DialogContent, DialogTitle, Grid, IconButton, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField } from "@mui/material";
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import Navbar from "./Navbar";
import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const baseUrl = 'http://localhost:8000/api/users';

// function createData(id, movieName, rating, cast, genre, releaseDate) {
//     return { id, movieName, rating, cast, genre, releaseDate };
// }
// const row = [
//     createData('1', 'Harry Potter', 8.2, ['Daniel Radcliffe', 'Rupert Grint', 'Emma Watson', 'Tom Felton'], 'Fantasy', Date()),
//     createData('2', 'Harry Potter', 8.2, ['Daniel Radcliffe', 'Rupert Grint', 'Emma Watson', 'Tom Felton'], 'Fantasy', Date()),
//     createData('3', '3 Idiots', 8.5, ['R.Madhavan', 'Sharman Joshi', 'Aamir Khan', 'Kareena Kapoor'], 'Fiction', Date()),
//     createData('4', '3 Idiots', 8.5, ['R.Madhavan', 'Sharman Joshi', 'Aamir Khan', 'Kareena Kapoor'], 'Fiction', Date()),
//     createData('5', 'Mere Brother Ki Dulhan', 8.0, ['Imran Khan', 'Katrina Kaif', 'Ali'], 'Comedy', Date()),
//     createData('6', 'Mere Brother Ki Dulhan', 8.0, ['Imran Khan', 'Katrina Kaif', 'Ali'], 'Comedy', Date()),
// ];
const top100Actors = ['Scarlett Johansson', 'Robert Downey, Jr.', 'Samuel L. Jackson', 'Zoe Saldana', '	Chris Hemsworth',
    'Chris Pratt', 'Tom Cruise', 'Daniel Radcliffe', 'Emma Watson', 'Bradley Cooper', 'Leonardo DiCaprio', 'Brad Pitt', 'Jennifer Lawrence',
    'Aamir Khan', 'Akshay Kumar', 'Amjad Khan', 'Amitabh Bachchan', 'Govardhan Asrani', 'Ayushmann Khurrana', 'Amrish Puri', 'Darsheel Safary',
    'Deepika Padukone', 'Farida Jalal', 'Irrfan Khan', 'Konkona Sen Sharma', 'Madhavan', 'Manoj Bajpayee', 'Imran Khan', 'Katrina Kaif'];

export default function Home() {
    const [rows, setRows] = useState([]);
    const navigate = useNavigate();
    const [userId, setUserId] = useState(localStorage.getItem('userId'));
    const [accessToken, setAccessToken] = useState(localStorage.getItem('accessToken'));
    const [refreshToken, setRefreshToken] = useState(localStorage.getItem('refreshToken'));
    const [cast, setCast] = useState([]);
    const [movieData, setMovieData] = useState({
        movie_id: '',
        movie_name: '',
        movie_rating: null,
        movie_cast: [],
        movie_genre: '',
        movie_date: ''
    });

    useEffect(() => {
        setUserId(localStorage.getItem('userId'));
        console.log('Bearer ' + accessToken, refreshToken);
        const getMovies = () => {
            setAccessToken(localStorage.getItem('accessToken'));
            setRefreshToken(localStorage.getItem('refreshToken'));
            axios.defaults.headers.common['Authorization'] = 'Bearer ' + accessToken
            axios.get(`${baseUrl}/movies/${userId}`).then((resp) => {
                setRows(resp.data.movies);
                console.log('All movie', rows);
            }).catch(err => {
                if (!err.response) {
                    console.log('Error: Network Error');
                } else if (err.response.data.error === "jwt expired") {
                    console.log("Token expired: ", err.response.data.error);
                    axios.post('http://localhost:8000/api/auth/refresh_token', { 'refreshToken': refreshToken }).then((res) => {
                        console.log("Refresh resp: ", res);
                        localStorage.setItem('refreshToken', res.data.refreshToken);
                        localStorage.setItem('accessToken', res.data.accessToken);
                        // setAccessToken(localStorage.getItem('accessToken'));
                        // setRefreshToken(localStorage.getItem('refreshToken'));
                        // console.log("Refresh resp: ", localStorage.getItem);
                        getMovies();
                    })
                }
                else {
                    console.log(err.response.data);
                }
            })
        }
        getMovies();
    }, [rows, userId]);

    const handleChange = (event) => {
        const { name, value } = event.target;
        setMovieData({
            ...movieData,
            [name]: value
        });
    };

    const handleSubmit = () => {
        console.log(movieData);
        console.log("Localstorage: ", userId);
        axios.post(`${baseUrl}/movies/${userId}`, movieData).then((response) => {
            console.log("Response: ", response);
            if (response) {
                alert('Movie added successfully');
            }
        }).catch(err => {
            if (!err.response) {
                console.log('Error: Network Error');
            } else {
                alert('An error occurred', err.response.data.error);
                console.log(err.response);
            }
        })
    };

    const handleEdit = async (data) => {
        // movieData.movie_cast = data.movie_cast;
        console.log("Edit: ", data);
        // setMovieData(data);
        // setOpen(true);
        // const resp = await axios.put(`${baseUrl}/movies/${data.movie_id}`, data);
        // console.log(resp);
        // alert('Movie deleted successfully');
    }

    const handleDelete = async (movieId) => {
        console.log("Movieid: ", movieId);
        const resp = await axios.delete(`${baseUrl}/movies/${movieId}`, {
            headers: {
                'Authorization': 'Bearer ' + accessToken,
            }
        });
        console.log(resp);
        alert('Movie deleted successfully');
    }

    return (
        <>
            <Navbar />
            <h1>Movie list</h1>
            <Grid container>
                <Grid item xs={12} sx={{ textAlign: 'right', px: 3, m: 2 }}>
                    <Grid container>
                        <Grid item xs={5} sx={{ mx: 1 }}>
                            <TextField
                                margin="normal"
                                fullWidth
                                id="movie_name"
                                label="Movie Name"
                                name="movie_name"
                                value={movieData.movie_name}
                                onChange={handleChange}
                            />
                        </Grid>
                        <Grid item xs={5} sx={{ mx: 1 }}>
                            <TextField
                                margin="normal"
                                fullWidth
                                name="movie_rating"
                                label="Rating"
                                type="number"
                                id="rating"
                                value={movieData.movie_rating}
                                onChange={handleChange}
                            />

                        </Grid>
                        <Grid item xs={10.1} sx={{ mx: 1 }}>
                            <Autocomplete
                                multiple
                                options={top100Actors.map((option) => option)}
                                defaultValue={[top100Actors[10]]}
                                onChange={(e, value) => {
                                    setCast((state) => value);
                                    setMovieData({
                                        ...movieData,
                                        movie_cast: cast
                                    })
                                }}
                                freeSolo
                                renderTags={(value, getTagProps) =>
                                    value.map((option, index) => (
                                        <Chip variant="outlined" label={option} {...getTagProps({ index })} />
                                    ))
                                }
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        variant="outlined"
                                        label="Cast"
                                        placeholder="select cast"
                                    />
                                )}
                            />
                            {/* <TextField
                                margin="normal"
                                fullWidth
                                name="cast"
                                label="Cast Names"
                                type="text"
                                id="cast"
                                value={movieData.cast}
                                onChange={handleChange}
                            /> */}

                        </Grid>
                        <Grid item xs={5} sx={{ mx: 1 }}>
                            <TextField
                                margin="normal"
                                fullWidth
                                name="movie_genre"
                                label="Genre"
                                type="text"
                                id="genre"
                                value={movieData.movie_genre}
                                onChange={handleChange}
                            />

                        </Grid>
                        <Grid item xs={5} sx={{ mx: 1 }}>
                            <TextField
                                margin="normal"
                                fullWidth
                                name="movie_date"
                                type="date"
                                id="releaseDate"
                                value={movieData.movie_releaseDate}
                                onChange={handleChange}
                            />
                        </Grid>
                        <Grid container>
                            <Grid item xs={12} sx={{ textAlign: 'left', mx: 1 }}>
                                <Button variant="contained" onClick={handleSubmit} color="success" endIcon={<AddCircleIcon />}>
                                    Add
                                </Button>
                            </Grid>
                        </Grid>
                    </Grid>

                </Grid>
                <Grid item xs={12}>
                    <TableContainer component={Paper}>
                        <Table sx={{ minWidth: '50%' }}>
                            <TableHead>
                                <TableRow>
                                    <TableCell sx={{ fontWeight: 'bold' }}>Movie name</TableCell>
                                    <TableCell sx={{ fontWeight: 'bold' }}>Rating</TableCell>
                                    <TableCell sx={{ fontWeight: 'bold' }}>Cast</TableCell>
                                    <TableCell sx={{ fontWeight: 'bold' }}>Genre</TableCell>
                                    <TableCell sx={{ fontWeight: 'bold' }}>Release Date</TableCell>
                                    <TableCell sx={{ fontWeight: 'bold' }}>Actions</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {rows.map((row) => {
                                    return (
                                        <TableRow key={row.movie_id} onClick={() => setMovieData(row)}>
                                            <TableCell component="th" scope="row">
                                                {row.movie_name}
                                            </TableCell>
                                            <TableCell>{row.movie_rating}</TableCell>
                                            <TableCell>{row.movie_cast.map((castName) => castName + ", ")}</TableCell>
                                            <TableCell>{row.movie_genre}</TableCell>
                                            <TableCell>{row.movie_date}</TableCell>
                                            <TableCell>
                                                {/* <IconButton aria-label="delete" color="primary" onClick={() => handleEdit(row)}>
                                                    <EditIcon />
                                                </IconButton> */}
                                                <IconButton aria-label="delete" color="warning" onClick={() => handleDelete(row.movie_id)}>
                                                    <DeleteIcon />
                                                </IconButton>
                                            </TableCell>
                                        </TableRow>
                                    )
                                })}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Grid>
            </Grid>
        </>
    )
}