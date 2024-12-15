import { useNavigate } from "react-router-dom";
import axios from "axios";

import AnswerList from '../templates/AnswerList';
const API_STEM_URL = process.env.REACT_APP_API_STEM_URL;
const getEndPoint = (path) => `${API_STEM_URL}/${path}`;

export const useCalculateAnswer = () => {
  const navigate = useNavigate();

  const calculateAnswer = (question_id, answerState, userState, resultList) => {
    return new Promise((resolve, reject) => {
      console.log("回答集計処理");
      const answerEndpoint = getEndPoint(`answer/question/${question_id}`);

      axios
        .get(answerEndpoint)
        .then((res) => {
          console.log("res.data", res.data);

          console.log("回答集計処理");

          let answer_id = null;
          let content = null;
          let score = null;
          let rank = null;
          let num = 0;
          let resultList = [];
          let tmp = [res.data[0]];
          let idxtmp = 0;
          let idx = 0;

          if (res.data[0].user_id === userState.user_id) {
            answer_id = res.data[0].answer_id;
            content = res.data[0].content;
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
              answer_id = res.data[i].answer_id;
              content = res.data[i].content;
              score = res.data[i].score;
              rank = res.data[i].rank;
              num++;
              idx = idxtmp;
            }
          }
          resultList.push(tmp);

          let zeroAnswerNum = 0;
          // 先頭に回答者0人の回答を追加する
          for (let i = AnswerList[question_id].length - 1; i >= 0; i--) {
            const answer = AnswerList[question_id][i];
            if (!resultList.some(group => group.some(item => item.content === answer))) {
              resultList.unshift([{
                user_id: null,
                question_id: question_id,
                content: answer,
                answer_id: null,
                first_name: null,
                last_name: null,
                department: null,
                score: 0,
                rank: 0
              }]);
              zeroAnswerNum++;
            }
          }

          console.log(resultList);

          const userEndpoint = getEndPoint(`user/${userState.user_id}`);

          axios
            .get(userEndpoint)
            .then((userRes) => {
              console.log("userRes.data", userRes.data);

              console.log("ユーザー属性計算処理");

              console.log(`TotalScore: ${userRes.data.total_score}, Rank: ${userRes.data.rank}`);

              navigate(
                "/QResult",
                {
                  state: {
                    question_id: question_id,
                    answerState: {
                      user_id: answerState.user_id,
                      question_id: answerState.question_id,
                      content: content,
                      answer_id: answer_id,
                      score: score,
                      rank: rank,
                      num: num,
                      idx: idx + zeroAnswerNum
                    },
                    userState: userRes.data,
                    resultList: resultList
                  }
                }
              );

              resolve();
            })
            .catch((err) => {
              console.log("ユーザー属性計算処理に失敗しました。", err);
              console.log("answerState", answerState);
              console.log("userState", userState);
              console.log("resultList", resultList);
              navigate(
                "/WaitingForQResult",
                {
                  state: {
                    question_id: question_id,
                    answerState: answerState,
                    userState: userState,
                    resultList: resultList
                  }
                }
              );
              reject(err);
            });
        })
        .catch((err) => {
          console.log("回答集計に失敗しました。", err);
          console.log("answerState", answerState);
          console.log("userState", userState);
          console.log("resultList", resultList);
          navigate(
            "/WaitingForQResult",
            {
              state: {
                question_id: question_id,
                answerState: answerState,
                userState: userState,
                resultList: resultList
              }
            }
          );
          reject(err);
        });
    });
  };

  return { calculateAnswer };
};
