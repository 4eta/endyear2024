import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { CircularProgress, Container, Alert } from '@mui/material';
import { Chart as ChartJS, registerables } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import background from "../../img/backgroundimage2.png";
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

    const loadNo1Answer = async (user_id) => {
        try {
            setLoading(true);
            setError(null);

            const endpoint = getEndPoint(`answer/user/${user_id}`);
            const response = await axios.get(endpoint);
            console.log("TOP5USERS", response.data);
        } catch (err) {
            console.error("回答の読み込みに失敗しました。", err);
            setError('回答の読み込み中にエラーが発生しました');
        } finally {
            setLoading(false);
        }
    };

    // Load users when component mounts
    useEffect(() => {
        loadUsers();
    }, []);

    // Load No.1 user's answer when top5 changes
    useEffect(() => {
        if (users.length > 0) {
            const top5 = users.slice(0, 5);
            loadNo1Answer(top5[0].user_id);
        }
    }, [users]);

    // userをuser.total_scoreで降順にソート
    users.sort((a, b) => b.total_score - a.total_score);

    // 上5人のみを取得
    const top5 = users.slice(0, 5);

    // 背景色を取得
    const getColorByDepartment = (department) => {
        const dept = DepartmentList.find(d => d.label === department);
        return dept ? dept.color : '#A6ff00';
    };

    const getLengthOfChart = (total_score) => {
        const percent = (total_score - top5[4].total_score) / (top5[0].total_score - top5[4].total_score) * 50 + 50;
        return percent;
    };

    return (
        <Container maxWidth="md" className="container">
            <img src={background} alt="background" className="background-image" />
            {loading && (
                <CircularProgress className="loading" />
            )}
            {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

            {users.length > 0 && (
                <div className="chart-container">
                    <div className='title'>
                        得点TOP5
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
                                </div>
                            </td>
                            <td>
                                <div className='chart'>
                                    {top5.map((user) => (
                                        <div className='graph' style={{ background: getColorByDepartment(user.department), width: `${getLengthOfChart(user.total_score)}%` }}>
                                            <div className='userName'>{`${user.last_name} ${user.first_name}`} <span style={{ fontSize: '19px' }}>{user.department}</span></div>
                                            <div className='total-score' style={{ right: getLengthOfChart(user.total_score) < 65 ? '-80px' : '20px' }}>{user.total_score}</div>
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