import React, { useState } from 'react';
import {
    Box,
    Card,
    CardContent,
    Typography,
    Button,
    Paper,
    Grid,
    Tooltip,
    LinearProgress,
    Stack,
    Divider
} from '@mui/material';
import {
    PlayArrow as PlayArrowIcon,
    BarChart as BarChartIcon,
    CheckCircle as CheckCircleIcon,
    Start as StartIcon,
    Stop as StopIcon
} from '@mui/icons-material';
import axios from "axios";

const API_STEM_URL = process.env.REACT_APP_API_STEM_URL;
const getEndPoint = (path) => `${API_STEM_URL}/${path}`;

const Admin = () => {
    const [quizStates, setQuizStates] = useState([
        { id: 0, isStarted: false, isAnalyzed: false, loading: false },
        { id: 1, isStarted: false, isAnalyzed: false, loading: false },
        { id: 2, isStarted: false, isAnalyzed: false, loading: false },
        { id: 3, isStarted: false, isAnalyzed: false, loading: false },
        { id: 4, isStarted: false, isAnalyzed: false, loading: false },
        { id: 5, isStarted: false, isAnalyzed: false, loading: false },
    ]);
    const [eventLoading, setEventLoading] = useState(false);
    const [eventStarted, setEventStarted] = useState(false);
    const [eventEnded, setEventEnded] = useState(false);

    // イベント開始処理
    const handleEventStart = async () => {
        try {
            setEventLoading(true);
            const endpoint = getEndPoint('progress/1');
            
            await axios
                .put(endpoint, null, { params: { status: 0 } })
                .then((res) => {
                    console.log('イベントを開始しました');
                    setEventStarted(true);
                })
                .catch((err) => {
                    console.log("イベント開始に失敗しました。", err);
                });
        } catch (error) {
            console.error('Failed to start event:', error);
        } finally {
            setEventLoading(false);
        }
    };

    // イベント終了処理
    const handleEventEnd = async () => {
        try {
            setEventLoading(true);
            const endpoint = getEndPoint('progress/1');
            
            await axios
                .put(endpoint, null, { params: { status: 3 } })
                .then((res) => {
                    console.log('イベントを終了しました');
                    setEventEnded(true);
                })
                .catch((err) => {
                    console.log("イベント終了に失敗しました。", err);
                });
        } catch (error) {
            console.error('Failed to end event:', error);
        } finally {
            setEventLoading(false);
        }
    };

    // 問題開始処理
    const handleStart = async (quizId) => {
        try {
            setQuizStates(prevStates =>
                prevStates.map(quiz =>
                    quiz.id === quizId ? { ...quiz, loading: true } : quiz
                )
            );

            const endpoint = getEndPoint('progress/1');
            await axios
                .put(endpoint, null, { params: { status: quizId * 100 + 1 } })
                .then((res) => {
                    console.log(`${quizId}の開始フラグを立てました`);
                })
                .catch((err) => {
                    console.log("問題開始に失敗しました。", err);
                });

            setQuizStates(prevStates =>
                prevStates.map(quiz =>
                    quiz.id === quizId ? { ...quiz, isStarted: true, loading: false } : quiz
                )
            );
        } catch (error) {
            console.error('Failed to start quiz:', error);
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

            const endpoint_analyze = getEndPoint(`answer/all/${quizId}`);
            await axios
                .put(endpoint_analyze, null, { params: { question_id: quizId } })
                .then((res) => {
                    console.log(`${quizId}の集計を行いました`);
                })
                .catch((err) => {
                    console.log("集計に失敗しました。", err);
                });

            const endpoint_user = getEndPoint(`user/${quizId}`);
            await axios
                .put(endpoint_user, null, { params: { question_id: quizId } })
                .then((res) => {
                    console.log(`${quizId}のスコア、順位を更新しました`);
                })
                .catch((err) => {
                    console.log("ユーザーのスコア、順位の更新に失敗しました。", err);
                });

            const endpoint_progress = getEndPoint(`progress/1`);
            await axios
                .put(endpoint_progress, null, { params: { status: quizId * 100 + 2 } })
                .then((res) => {
                    console.log(`${quizId}の集計完了フラグを立てました`);
                })
                .catch((err) => {
                    console.log("集計に失敗しました。", err);
                });

            setQuizStates(prevStates =>
                prevStates.map(quiz =>
                    quiz.id === quizId ? { ...quiz, isStarted: true, isAnalyzed: true, loading: false } : quiz
                )
            );
        } catch (error) {
            console.error('Failed to analyze quiz:', error);
            setQuizStates(prevStates =>
                prevStates.map(quiz =>
                    quiz.id === quizId ? { ...quiz, loading: false } : quiz
                )
            );
        }
    };

    return (
        <Box sx={{ maxWidth: 800, margin: 'auto', p: 2 }}>
            <Card>
                <CardContent>
                    <Typography variant="h5" gutterBottom>
                        イベント管理
                    </Typography>
                    <Paper elevation={1} sx={{ p: 2, mb: 3 }}>
                        {eventLoading && (
                            <LinearProgress
                                sx={{
                                    position: 'absolute',
                                    top: 0,
                                    left: 0,
                                    right: 0
                                }}
                            />
                        )}
                        <Stack direction="row" spacing={2} justifyContent="center">
                            <Button
                                variant="contained"
                                startIcon={<StartIcon />}
                                onClick={handleEventStart}
                                disabled={eventStarted || eventLoading}
                                color="success"
                                size="large"
                            >
                                イベント開始
                            </Button>
                            <Button
                                variant="contained"
                                startIcon={<StopIcon />}
                                onClick={handleEventEnd}
                                disabled={eventEnded || eventLoading || !eventStarted}
                                color="error"
                                size="large"
                            >
                                イベント終了
                            </Button>
                        </Stack>
                    </Paper>

                    <Divider sx={{ my: 3 }} />

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
                                                disabled={quiz.isStarted || quiz.loading || !eventStarted || eventEnded}
                                                color="primary"
                                            >
                                                開始
                                            </Button>
                                            <Button
                                                variant="contained"
                                                startIcon={<BarChartIcon />}
                                                onClick={() => handleAnalyze(quiz.id)}
                                                disabled={!quiz.isStarted || quiz.isAnalyzed || quiz.loading || !eventStarted || eventEnded}
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