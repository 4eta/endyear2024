import axios from "axios";

const API_STEM_URL = process.env.REACT_APP_API_STEM_URL;
const getEndPoint = (path) => `${API_STEM_URL}/${path}`;

export const useToQResult = () => {

  const toQResult = async () => {
    console.log("結果待機画面の次へ進むボタン処理");
    const endpoint = getEndPoint("progress/1");

    try {
      const res = await axios.get(endpoint);
      console.log(res.data);
      console.log("結果待機画面処理");

      return res.data.status;
    } catch (err) {
      console.log("結果待機画面処理に失敗しました。", err);
      return 0; 
    }
  };

  return { toQResult };
};
