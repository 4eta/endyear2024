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

    console.log("データ", data);

    axios
      .post(endpoint, data)
      .then((res) => {
        console.log("res.data", res.data);

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
        console.log("回答提出に失敗しました。", err);
        console.log("answerState", answerState);
        console.log("userState", userState);
        navigate(
          "/QAsk",
          {
            state: {
              answerState: answerState,
              userState: userState,
              question_id: question_id
            }  
          }
        );
      });
  };

  return { submitAnswer };
};
