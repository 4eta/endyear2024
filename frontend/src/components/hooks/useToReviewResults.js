import { useNavigate } from "react-router-dom";
import axios from "axios";

import AnswerList from '../templates/AnswerList';
const API_STEM_URL = process.env.REACT_APP_API_STEM_URL;
const getEndPoint = (path) => `${API_STEM_URL}/${path}`;

export const useToReviewResults = () => {
    const navigate = useNavigate();

    const toReviewResults = (question_id, answerState, userState, resultList) => {
        return new Promise((resolve, reject) => {
            console.log("回答履歴取得処理");

            const resultLists = [];
            const answerStates = [];
            const promises = [];

            for (let id = 0; id <= 5; id++) {
                const answerEndpoint = getEndPoint(`answer/question/${id}`);
                const promise = axios.get(answerEndpoint)
                    .then((res) => {
                        console.log(`回答履歴取得処理${id}番目`);

                        let score = null;
                        let rank = null;
                        let num = 0;
                        let content = null;
                        let answer_id = null;
                        let resultList = [];
                        let tmp = [res.data[0]];
                        let idxtmp = 0;
                        let idx = 0;

                        if (res.data[0].user_id === userState.user_id) {
                            score = res.data[0].score;
                            rank = res.data[0].rank;
                            num++;
                            idx = idxtmp;
                        }

                        for (let i = 1; i < res.data.length; i++) {
                            if (res.data[i].content === tmp[0].content) {
                                tmp.push(res.data[i]);
                            } else {
                                resultList.push(tmp);
                                tmp = [res.data[i]];
                                idxtmp++;
                            }
                            if (res.data[i].user_id === userState.user_id) {
                                score = res.data[i].score;
                                rank = res.data[i].rank;
                                num++;
                                content = res.data[i].content;
                                answer_id = res.data[i].answer_id;
                                idx = idxtmp;
                            }
                        }
                        resultList.push(tmp);

                        let zeroAnswerNum = 0;
                        // 先頭に回答者0人の回答を追加する
                        for (let i = AnswerList[id].length - 1; i >= 0; i--) {
                            const answer = AnswerList[id][i];
                            if (!resultList.some(group => group.some(item => item.content === answer))) {
                                resultList.unshift([{
                                    user_id: null,
                                    question_id: id,
                                    content: answer,
                                    answer_id: null,
                                    first_name: null,
                                    last_name: null,
                                    department: null,
                                    score: 0,
                                    rank: 0,
                                }]);
                                zeroAnswerNum++;
                            }
                        }
                        resultLists.push(resultList);
                        answerStates.push({
                            user_id: userState.user_id,
                            question_id: id,
                            content: content,
                            answer_id: answer_id,
                            score: score,
                            rank: rank,
                            num: num,
                            idx: idx + zeroAnswerNum
                        });
                    })
                    .catch((err) => {
                        console.log("回答履歴取得処理に失敗しました。", err);
                        reject(err);
                    });

                promises.push(promise);
            }

            Promise.all(promises).then(() => {
                console.log("ReviewResultsへ遷移");
                navigate(
                    "/ReviewResults",
                    {
                        state: {
                            question_id: question_id,
                            answerStates: answerStates,
                            userState: userState,
                            resultLists: resultLists
                        }
                    }
                );
                resolve();
            }).catch((err) => {
                console.log("回答履歴取得処理に失敗しました。", err);
                navigate(
                    "/QResult",
                    {
                        state: {
                            question_id: question_id,
                            answerState: answerState,
                            userState: userState,
                            resultList: resultList,
                        }
                    }
                );
                reject(err);
            });
        });
    };

    return { toReviewResults };
};