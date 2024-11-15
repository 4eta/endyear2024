import { useNavigate } from "react-router-dom";
import axios from "axios";

const API_STEM_URL = process.env.REACT_APP_API_STEM_URL;
const getEndPoint = (path) => `${API_STEM_URL}/${path}`;

export const useLogin = () => {
  const navigate = useNavigate();

  const login = (user) => {
    console.log("ログイン処理");
    // ユーザーの存在確認と登録のエンドポイント
    const endpoint = getEndPoint("user");

    // クエリにfirst_name, last_name, departmentを使用
    const queries = { 
      first_name: user.first_name, 
      last_name: user.last_name, 
      department: user.department,
    };

    console.log("クエリ", queries);

    // ユーザーの存在確認
    axios
      .get(endpoint, { params: queries })
      .then((res) => {
        console.log(res.data);
        // backendの仕様から、ユーザーが存在する場合はそのユーザーの情報が返ってくる
        // ユーザーが存在しない場合は入力データで新規登録し、そのユーザー情報が返ってくる
        console.log("ログイン処理");

        // 出題待機画面にリダイレクト
        navigate(
          "/WaitingForQAsk", 
          { 
              state: {
                answerState:{
                  user_id: res.data.user_id,
                  question_id: 0,
                  content: null,
                  answer_id: null
                },
                userState:{
                  user_id: res.data.user_id,
                  first_name: res.data.first_name, 
                  last_name: res.data.last_name, 
                  department: res.data.department, 
                  is_admin: res.data.is_admin,
                  total_score: res.data.total_score, 
                  rank: res.data.rank 
                } 
              } 
          }
      );
      })
      .catch((err) => {
        console.log("ログインに失敗しました。", err);
        navigate("/Login");
      });
  };

  return { login };
};
