import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { CircularProgress, Container, Typography, Alert, Grid } from '@mui/material';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, registerables } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import background from "../../img/backgroundimage.jpg"
ChartJS.register(...registerables, ChartDataLabels);

const API_STEM_URL = process.env.REACT_APP_API_STEM_URL;
const getEndPoint = (path) => `${API_STEM_URL}/${path}`;

const Ranking = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [rankingType] = useState('final'); // Set default to final ranking

    const loadUsers = async () => {
        try {
            setLoading(true);
            setError(null);

            const endpoint = getEndPoint('user/list/all');
            const response = await axios.get(endpoint);
            setUsers(response.data);
        } catch (err) {
            console.error("ユーザーの読み込みに失敗しました。", err);
            setError('ユーザーの読み込み中にエラーが発生しました');
        } finally {
            setLoading(false);
        }
    };

    // Load users when component mounts
    useEffect(() => {
        loadUsers();
    }, []);

    // userをuser.total_scoreで降順にソート
    users.sort((a, b) => b.total_score - a.total_score);

    // 上10人のみを取得
    const top10 = users.slice(0, 10);
    const labels = top10.map((user) => `${user.last_name} ${user.first_name} さん`);

    const chartData = {
        labels,
        datasets: [
            {
                label: '', // Empty label to remove legend
                data: top10.map((user) => user.total_score),
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1,
            },
        ],
    };

    const options = {
        indexAxis: 'y', 
        responsive: true,
        plugins: {
            legend: {
                display: false,
            },
            datalabels: {
                anchor: 'end',
                align: 'end',
                offset: 4,
                color: 'black',
                font: {
                    weight: 'bold'
                }
            }
        },
        scales: {
            x: {
                display: false, 
                beginAtZero: true
            },
            y: {
                display: true,
                grid: {
                    display: false
                }
            }
        }
    };

    return (
        <Container maxWidth="md" sx={{
            mt: 4,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundColor: 'rgba(255, 255, 255, 0.9)',
            padding: 2,
            borderRadius: 2,
        }}>
            <img src={background} alt="background" style={{ width: "100%", height: "auto", position: "fixed", top: 0, left: 0, zIndex: -1 }} />
            <Typography variant="h4" gutterBottom sx={{
                textAlign: 'center',
                mb: 2,
            }}>
                ユーザーランキング
            </Typography>

            {loading && (
                <CircularProgress sx={{ display: 'block', margin: '20px auto' }} />
            )}
            {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

            {users.length > 0 && (
                <Grid container justifyContent="center">
                    <Bar data={chartData} options={options}></Bar>
                </Grid>
            )}
        </Container>
    );
};

export default Ranking;