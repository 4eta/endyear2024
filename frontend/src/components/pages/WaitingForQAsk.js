import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import '../css/common.css';
import '../css/waitingforqestion.css';
import Header from '../elements/Header';
import PleaseWaitModal from '../elements/PleaseWaitModal';
import { useToQAsk } from '../hooks/useToQAsk';
import { useCalculateAnswer } from '../hooks/useCalculateAnswer';
import { useToReviewResults } from '../hooks/useToReviewResults';

const WaitingForQAsk = () => {
  const { toQAsk } = useToQAsk();
  const { calculateAnswer } = useCalculateAnswer();
  const { toReviewResults } = useToReviewResults();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isFadingOut, setIsFadingOut] = useState(false);

  const handleCloseModal = () => {
    setIsFadingOut(true);
    setTimeout(() => {
      setIsModalOpen(false);
      setIsFadingOut(false);
    }, 500);
  };

  const handleOutsideClick = (e) => {
    if (e.target.className.includes('modalOverlay')) {
      handleCloseModal();
    }
  };

  const location = useLocation();
  const navigate = useNavigate();
  const { answerState, userState } = location.state;

  // console.log("WaitingForQ.js");
  // console.log("answerState", answerState);
  // console.log("userState", userState);


  const handleSubmit = async (event) => {
    event.preventDefault();
    const status = await toQAsk();
    if (status % 100 === 0) {
      setIsModalOpen(true);
    } else if (status % 100 === 1) {
      navigate('/QAsk', { state: { answerState: answerState, userState: userState, question_id: Math.floor(status / 100) } });
    } else if (status % 100 === 2) {
      calculateAnswer(
        Math.floor(status / 100),
        {
          user_id: answerState.user_id,
          question_id: Math.floor(status / 100),
          content: null,
          answer_id: null,
          score: null,
          rank: null,
          num: null,
          idx: 0,
        },
        userState,
        null
      )
    } else if (status % 100 === 3) {
      toReviewResults(5, answerState, userState, []);
    }
  };

  return (
    <div className="background">
      <Header user={userState} question_id={0} resultFlag={false} />

      <div className="explanation">
        <p className="title">オンリーワンゲーム　ルール説明</p>
        <p>
          ① 答えがたくさんあるお題が出題されます。(全6問)<br />
          <span className="notation">　　(例：都道府県)</span><br />
          ② 他人と<span className="emphasize">被らなさそうな回答</span>を考え提出します。<br />
          ③ 集計結果に応じて、ポイントをゲットします。<br />
          ・<span className="emphasize">オンリーワンの回答：満点</span><br />
          ・<span className="emphasize">シス研1年目社員</span>と被ると<span className="emphasize">ボーナスポイント加算</span><br />
          ・被った人数が多いほどポイントダウン<br />
          <br />
          獲得ポイントが最も高い人が<span className="emphasize">優勝！</span><br />
        </p>
      </div>
      <div className="enjoyPoint">
        <p style={{ fontWeight: '700', fontSize: '16px' }}>ゲームの楽しみ方</p>
        <p>
          ・自分と同じ回答をした仲間を探してみよう！<br />
          ・オンリーワンの回答、最も被った回答を<br />
          見てみよう！<br />
          ・シス研1年目社員を覚えよう！<br />
        </p>
      </div>
      <div className="blur" style={{ height: '78px', top: '550px', position: 'absolute' }}>
        <button
          type="submit"
          className="btn"
          onClick={handleSubmit}>
          出題画面へ ▶
        </button>
      </div>
      {
        isModalOpen && (
          <div className={`modalOverlay ${isFadingOut ? 'fadeOut' : ''}`} onClick={handleOutsideClick}>
            <PleaseWaitModal onClose={handleCloseModal} />
          </div>
        )
      }
    </div >
  );
};

export default WaitingForQAsk;
