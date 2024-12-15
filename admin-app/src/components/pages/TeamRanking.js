import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { CircularProgress, Container, Alert } from '@mui/material';
import { Chart as ChartJS, registerables } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import background from "../../img/backgroundimage1.jpg";
import './Ranking.css';
import DepartmentList from "../template/DepartmentList";

ChartJS.register(...registerables, ChartDataLabels);

const API_STEM_URL = process.env.REACT_APP_API_STEM_URL;
const getEndPoint = (path) => `${API_STEM_URL}/${path}`;

const Ranking = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

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

    const departmentScores = {};

    // Calculate total scores and counts for each department
    users.forEach(user => {
        const department = user.department;
        if (!departmentScores[department]) {
            departmentScores[department] = { total_score: 0, count: 0 };
        }
        departmentScores[department].total_score += user.total_score;
        departmentScores[department].count += 1;
    });


    // Calculate average scores for each department
    const averageScores = Object.keys(departmentScores).map(department => {
        const data = departmentScores[department];
        return {
            department: department,
            average_score: data.total_score / data.count
        };
    });

    console.log(averageScores);

    // avarageScoresをavarageScores.avarage_scoreで降順にソート
    averageScores.sort((a, b) => b.average_score - a.average_score);

    // 背景色を取得
    const getColorByDepartment = (department) => {
        const dept = DepartmentList.find(d => d.label === department);
        return dept ? dept.color : '#A6ff00';
    };

    const getLengthOfChart = (total_score) => {
        const percent = (total_score - averageScores[6].average_score) / (averageScores[0].average_score - averageScores[6].average_score) * 50 + 50;
        return percent;
    };

    return (
        <Container maxWidth="md" className="container">
            <img src={background} alt="background" className="background-image" />
            {loading && (
                <CircularProgress className="loading" />
            )}
            {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

            {averageScores.length > 0 && (
                <div className="chart-container">
                    <div className='title'>
                        チーム平均得点
                    </div>
                    <table className='chart-table'>
                        <tr>
                            <td width={'14%'}>
                                <div className='rank'>
                                    <div>1位</div>
                                    <div>2位</div>
                                    <div>3位</div>
                                    <div>4位</div>
                                    <div>5位</div>
                                    <div>6位</div>
                                    <div>7位</div>
                                </div>
                            </td>
                            <td>
                                <div className='chart'>
                                    {averageScores.map((dep) => (
                                        <div className='graph' style={{ background: getColorByDepartment(dep.department), width: `${getLengthOfChart(dep.average_score)}%` }}>
                                            <div className='userName'>{dep.department}</div>
                                            <div className='total-score' style={{ right: '20px' }}>
                                                {dep.average_score.toFixed(1)}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </td>
                        </tr>
                    </table>

                </div>
            )
            }
        </Container >
    );
};

export default Ranking;