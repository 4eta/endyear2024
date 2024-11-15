import React, { useState } from 'react';
import axios from 'axios';
import { Button, CircularProgress, Container, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, Alert, Grid, ButtonGroup } from '@mui/material';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, registerables } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
ChartJS.register(...registerables, ChartDataLabels);

const API_STEM_URL = process.env.REACT_APP_API_STEM_URL;
const getEndPoint = (path) => `${API_STEM_URL}/${path}`;

const Ranking = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [rankingType, setRankingType] = useState('interim'); // 'interim', 'final', or 'group'

    const loadUsers = async (type) => {
        try {
            setLoading(true);
            setError(null);
            setRankingType(type);

            // エンドポイントを選択
            let endpoint;
            switch (type) {
                default:
                    endpoint = getEndPoint('user/list/all');
            }

            const response = await axios.get(endpoint);
            switch (type) {
                case 'group':
                    // グループ（部署）ごとに集計
                    const departmentGroups = response.data.reduce((groups, user) => {
                        const dept = user.department || '未所属';
                        if (!groups[dept]) {
                            groups[dept] = {
                                scores: [],
                                total: 0,
                                count: 0
                            };
                        }
                        groups[dept].scores.push(user.total_score);
                        groups[dept].total += user.total_score;
                        groups[dept].count += 1;
                        return groups;
                    }, {});

                    // 部署ごとの平均スコアを計算し、新しいユーザー配列を作成
                    const departmentAverages = Object.entries(departmentGroups).map(([dept, data]) => ({
                        last_name: dept,
                        first_name: `(${data.count}名)`,
                        department: dept,
                        total_score: Math.round(data.total / data.count) // 平均点を四捨五入
                    }));

                    setUsers(departmentAverages);
                    break;
                default:
                    setUsers(response.data);
            }
        } catch (err) {
            console.error("ユーザーの読み込みに失敗しました。", err);
            setError('ユーザーの読み込み中にエラーが発生しました');
        } finally {
            setLoading(false);
        }
    };

    // userをuser.total_scoreで降順にソート
    users.sort((a, b) => b.total_score - a.total_score);

    // 上10人のみを取得
    const top10 = users.slice(0, 10);
    const labels = top10.map((user) => {
        if (rankingType === 'group') {
            return `${user.last_name} ${user.first_name}`;
        }
        return `${user.last_name}さん`;
    });

    const chartData = {
        labels,
        datasets: [
            {
                label: rankingType === 'group' ? '平均スコア' : 'スコア',
                data: top10.map((user) => user.total_score),
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1,
            },
        ],
    };

    const getRankingTitle = () => {
        switch (rankingType) {
            case 'interim':
                return '中間';
            case 'final':
                return '最終';
            case 'group':
                return '部署別平均';
            default:
                return '';
        }
    };

    const options = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
            },
            title: {
                display: true,
                text: `${getRankingTitle()}順位表`,
                font: {
                    size: 16
                }
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
            y: {
                beginAtZero: true
            }
        }
    };

    return (
        <Container maxWidth="md" sx={{ mt: 4 }}>
            <Typography variant="h4" gutterBottom>
                ユーザーランキング
            </Typography>

            <ButtonGroup variant="contained" sx={{ mb: 3 }}>
                <Button
                    color="primary"
                    onClick={() => loadUsers('interim')}
                    variant={rankingType === 'interim' ? 'contained' : 'outlined'}
                >
                    中間結果
                </Button>
                <Button
                    color="primary"
                    onClick={() => loadUsers('final')}
                    variant={rankingType === 'final' ? 'contained' : 'outlined'}
                >
                    最終順位
                </Button>
                <Button
                    color="primary"
                    onClick={() => loadUsers('group')}
                    variant={rankingType === 'group' ? 'contained' : 'outlined'}
                >
                    部署別平均
                </Button>
            </ButtonGroup>

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