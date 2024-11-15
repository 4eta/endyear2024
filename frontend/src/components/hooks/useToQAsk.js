import axios from "axios";

const API_STEM_URL = process.env.REACT_APP_API_STEM_URL;
const getEndPoint = (path) => `${API_STEM_URL}/${path}`;

export const useToQAsk = () => {

  const toQAsk = async () => {
    console.log("出題待機画面の次へ進むボタン処理");
    const endpoint = getEndPoint("progress/1");

    try {
      const res = await axios.get(endpoint);
      console.log(res.data);
      console.log("出題待機画面処理");

      return res.data.status;
    } catch (err) {
      console.log("出題待機画面処理に失敗しました。", err);
      return 0; // Default to showing the modal on error
    }
  };

  return { toQAsk };
};
