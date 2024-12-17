import { useNavigate } from "react-router-dom";
import axios from "axios";

const API_STEM_URL = process.env.REACT_APP_API_STEM_URL;
const getEndPoint = (path) => `${API_STEM_URL}/${path}`;

export const useSubmitAnswer = () => {
  const navigate = useNavigate();

  const submitAnswer = (question_id, answer, answerState, userState) => {
    console.log("回答提出処理");
    const endpoint = getEndPoint("answer");

    const data = {
      user_id: userState.user_id,
      question_id: question_id,
      content: answer
    };

    axios
      .post(endpoint, data)
      .then((res) => {
        // console.log("res.data", res.data);

        console.log("回答登録処理");

        navigate(
          "/WaitingForQResult",
          {
            state: {
              question_id: question_id,
              answerState: {
                user_id: res.data.user_id,
                question_id: res.data.question_id,
                content: res.data.content,
                answer_id: res.data.answer_id
              },
              userState: userState,
              resultList: null
            }
          }
        );
      })
      .catch((err) => {
        console.log("すでに回答済みとして処理。", err);

        const errCaseEndpoint = getEndPoint(`answer/user/${userState.user_id}`)

        let content = null;
        let answer_id = null;

        axios
          .get(errCaseEndpoint)
          .then((res2) => {
            console.log("res2.data", res2.data);

            console.log("既存の回答を取得する処理");

            for (let i = 0; i < res2.data.length; i++) {
              if (res2.data.question_id === question_id) {
                content = res2.data.content;
                answer_id = res2.data.answer_id;
              }
            }

          })

        navigate(
          "/WaitingForQResult",
          {
            state: {
              question_id: question_id,
              answerState: {
                user_id: userState.user_id,
                question_id: question_id,
                content: content,
                answer_id: answer_id
              },
              userState: userState,
              resultList: null
            }
          }
        );
      });
  };

  return { submitAnswer };
};
