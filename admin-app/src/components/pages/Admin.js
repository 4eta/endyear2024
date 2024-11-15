import React, { useState } from 'react';
import {
    Box,
    Card,
    CardContent,
    Typography,
    Button,
    Paper,
    Grid,
    IconButton,
    Tooltip,
    LinearProgress,
    Stack
} from '@mui/material';
import {
    PlayArrow as PlayArrowIcon,
    BarChart as BarChartIcon,
    CheckCircle as CheckCircleIcon
} from '@mui/icons-material';
import axios from "axios";

const API_STEM_URL = process.env.REACT_APP_API_STEM_URL;
const getEndPoint = (path) => `${API_STEM_URL}/${path}`;

console.log(getEndPoint('progress/1'));

const Admin = () => {
    // 問題の状態を管理
    const [quizStates, setQuizStates] = useState([
        { id: 0, isStarted: false, isAnalized: false, loading: false },
        { id: 1, isStarted: false, isAnalyzed: false, loading: false },
        { id: 2, isStarted: false, isAnalyzed: false, loading: false },
        { id: 3, isStarted: false, isAnalyzed: false, loading: false },
        { id: 4, isStarted: false, isAnalyzed: false, loading: false },
        { id: 5, isStarted: false, isAnalyzed: false, loading: false },
    ]);

    // 問題開始処理
    const handleStart = async (quizId) => {
        try {
            // progressテーブルのquiz_id*2のis_startedをtrueに更新
            // FastAPI連携: progressテーブルの開始状態を更新
            setQuizStates(prevStates =>
                prevStates.map(quiz =>
                    quiz.id === quizId ? { ...quiz, loading: true } : quiz
                )
            );

            const endpoint = getEndPoint('progress/1');
            console.log(endpoint);

            // http://127.0.0.1:8000/progress/1にPUTリクエストを送信
            axios
                .put(endpoint, null, { params: { status: quizId * 100 + 1 } })
                .then((res) => {
                    console.log(res.data);
                    console.log(`${quizId}の開始フラグを立てました`);
                })
                .catch((err) => {
                    console.log("問題開始に失敗しました。", err);
                });
            // 成功後の状態更新
            setQuizStates(prevStates =>
                prevStates.map(quiz =>
                    quiz.id === quizId ? { ...quiz, isStarted: true, loading: false } : quiz
                )
            );
        } catch (error) {
            console.error('Failed to start quiz:', error);
            // エラー後のローディング状態解除
            setQuizStates(prevStates =>
                prevStates.map(quiz =>
                    quiz.id === quizId ? { ...quiz, loading: false } : quiz
                )
            );
        }
    };

    // 集計処理
    const handleAnalyze = async (quizId) => {
        try {
            setQuizStates(prevStates =>
                prevStates.map(quiz =>
                    quiz.id === quizId ? { ...quiz, loading: true } : quiz
                )
            );

            // 1. その問題の集計を行う
            const endpoint_analyze = getEndPoint(`answer/all/${quizId}`);
            await axios
                .put(endpoint_analyze, null, { params: { question_id: quizId } })
                .then((res) => {
                    console.log(res.data);
                    console.log(`${quizId}の集計を行いました`);
                })
                .catch((err) => {
                    console.log("集計に失敗しました。", err);
                });

            // 2. 集計結果をもとにユーザーのスコア、順位を更新
            const endpoint_user = getEndPoint(`user/${quizId}`);
            await axios
                .put(endpoint_user, null, { params: { question_id: quizId } })
                .then((res) => {
                    console.log(res.data);
                    console.log(`${quizId}のスコア、順位を更新しました`);
                })
                .catch((err) => {
                    console.log("ユーザーのスコア、順位の更新に失敗しました。", err);
                });

            // 3. progressテーブルをquizIdの回答集計済み状態に更新
            const endpoint_progress = getEndPoint(`progress/1`);
            await axios
                .put(endpoint_progress, null, { params: { status: quizId * 100 + 2 } })
                .then((res) => {
                    console.log(res.data);
                    console.log(`${quizId}の集計完了フラグを立てました`);
                })
                .catch((err) => {
                    console.log("集計に失敗しました。", err);
                });
            // 成功後の状態更新
            setQuizStates(prevStates =>
                prevStates.map(quiz =>
                    quiz.id === quizId ? { ...quiz, isStarted: true, loading: false } : quiz
                )
            );
        } catch (error) {
            console.error('Failed to start quiz:', error);
            // エラー後のローディング状態解除
            setQuizStates(prevStates =>
                prevStates.map(quiz =>
                    quiz.id === quizId ? { ...quiz, loading: false } : quiz
                )
            );
        }

        setQuizStates(prevStates =>
            prevStates.map(quiz =>
                quiz.id === quizId ? { ...quiz, isAnalyzed: true, loading: false } : quiz
            )
        );
    };

    return (
        <Box sx={{ maxWidth: 800, margin: 'auto', p: 2 }}>
            <Card>
                <CardContent>
                    <Typography variant="h5" gutterBottom>
                        クイズ進捗管理
                    </Typography>
                    <Stack spacing={2}>
                        {quizStates.map((quiz) => (
                            <Paper
                                key={quiz.id}
                                elevation={1}
                                sx={{
                                    p: 2,
                                    position: 'relative',
                                    overflow: 'hidden'
                                }}
                            >
                                {quiz.loading && (
                                    <LinearProgress
                                        sx={{
                                            position: 'absolute',
                                            top: 0,
                                            left: 0,
                                            right: 0
                                        }}
                                    />
                                )}
                                <Grid container alignItems="center" spacing={2}>
                                    <Grid item xs={4}>
                                        <Stack direction="row" spacing={1} alignItems="center">
                                            <Typography variant="h6">
                                                問題 {quiz.id}
                                            </Typography>
                                            {quiz.isStarted && (
                                                <Tooltip title="開始済み">
                                                    <CheckCircleIcon color="success" />
                                                </Tooltip>
                                            )}
                                        </Stack>
                                    </Grid>
                                    <Grid item xs={8}>
                                        <Stack direction="row" spacing={2} justifyContent="flex-end">
                                            <Button
                                                variant="contained"
                                                startIcon={<PlayArrowIcon />}
                                                onClick={() => handleStart(quiz.id)}
                                                disabled={quiz.isStarted || quiz.loading}
                                                color="primary"
                                            >
                                                開始
                                            </Button>
                                            <Button
                                                variant="contained"
                                                startIcon={<BarChartIcon />}
                                                onClick={() => handleAnalyze(quiz.id)}
                                                disabled={!quiz.isStarted || quiz.isAnalyzed || quiz.loading}
                                                color="secondary"
                                            >
                                                集計
                                            </Button>
                                        </Stack>
                                    </Grid>
                                </Grid>
                            </Paper>
                        ))}
                    </Stack>
                </CardContent>
            </Card>
        </Box>
    );
};

export default Admin;