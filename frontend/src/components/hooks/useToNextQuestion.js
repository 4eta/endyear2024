import axios from "axios";

const API_STEM_URL = process.env.REACT_APP_API_STEM_URL;
const getEndPoint = (path) => `${API_STEM_URL}/${path}`;

export const useToNextQuestion = () => {
  const toNextQuestion = async () => {
    console.log("次の問題へ進む処理");
    const endpoint = getEndPoint("progress/1");

    try {
      const res = await axios.get(endpoint);
      // console.log(res.data);
      console.log("次の問題へ進む処理");

      return res.data.status;
    } catch (err) {
      console.log("次の問題へ進む処理に失敗しました。", err);
      return 0;
    }
  };

  return { toNextQuestion };
};
