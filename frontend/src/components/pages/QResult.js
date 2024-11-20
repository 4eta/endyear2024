import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import '../css/common.css';
import '../css/result.css';
import Header from '../elements/Header';
import UserIcon from '../elements/UserIcon';
import ResultItem from '../elements/ResultItem';
import ResultModal from '../elements/ResultModal';
import QResultDetailModal from '../elements/QResultDetailModal';
import PleaseWaitModal from '../elements/PleaseWaitModal';
import QuestionList from '../templates/QuestionList';
import { useToNextQuestion } from '../hooks/useToNextQuestion';
import { useCalculateAnswer } from '../hooks/useCalculateAnswer';

const QResult = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { toNextQuestion } = useToNextQuestion();
  const { calculateAnswer } = useCalculateAnswer();
  const { question_id, answerState, userState, resultList } = location.state;

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isPWModalOpen, setIsPWModalOpen] = useState(false);
  const [isFadingOut, setIsFadingOut] = useState(false);

  const handleMyFrameClick = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleOutsideClick = (e) => {
    if (e.target.className.includes('modalOverlay')) {
      handleCloseModal();
    }
  };

  const handleDetailModalClick = () => {
    setIsDetailModalOpen(true);
  };

  const handleDetailCloseModal = () => {
    setIsDetailModalOpen(false);
  };

  const handleDetailOutsideClick = (e) => {
    if (e.target.className.includes('modalOverlayDetail')) {
      handleDetailCloseModal();
    }
  };

  const handlePWCloseModal = () => {
    setIsFadingOut(true);
    setTimeout(() => {
      setIsPWModalOpen(false);
      setIsFadingOut(false);
    }, 500);
  };

  const handlePWOutsideClick = (e) => {
    if (e.target.className.includes('modalOverlayPW')) {
      handlePWCloseModal();
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const status = await toNextQuestion();
    if (status % 100 === 1) {
      navigate(
        '/QAsk',
        {
          state: {
            answerState: answerState,
            userState: userState,
            question_id: Math.floor(status / 100),
          },
        }
      );
    } else if (status % 100 === 2 && Math.floor(status / 100) === question_id) {
      setIsPWModalOpen(true);
    } else {
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
      );
    }
  };

  console.log("QResult.js");
  console.log("answerState", answerState);
  console.log("userState", userState);
  console.log("resultList", resultList);

  return (
    <div className="background">
      <Header user={userState} />

      <div className="qFrameResult">
        <p className="qTitleResult">Q{question_id} {QuestionList[question_id].QTitle}</p>
        <div className="nextButton" onClick={handleSubmit}>
          <img src={`${process.env.PUBLIC_URL}/arrowrightwhite.png`} className="nextIcon" alt="Arrow Right" />
        </div>
      </div>
      <div className="myResultFrame" onClick={answerState.content !== null ? handleMyFrameClick : null}>
        <table>
          <tbody>
            <tr>
              <td className="myAnswerIs">あなたの回答</td>
              <td className="myAnswer">{answerState.content !== null ? answerState.content : '(無回答)'}</td>
              <td className="myPoint"><span style={{ fontSize: '16px', fontWeight: '700' }}>+{answerState.score !== null ? answerState.score : 0}</span>Pt</td>
            </tr>
          </tbody>
        </table>

        <p className="myRank">
          <span style={{ fontSize: '32px', fontWeight: '400' }}>{answerState.rank !== null ? answerState.rank : '-- '}</span><span style={{ fontSize: '16px', fontWeight: '700' }}>位</span><br />
          回答者 <span style={{ fontSize: '14px', fontWeight: '700' }}>{answerState.num !== 0 ? answerState.num : '--'}</span>人
        </p>

        <div className="icons">
          <div className="myIcon">
            {answerState.content !== null ? <UserIcon user={userState} /> : null}
          </div>
          <div className="otherIcon">
            <div className="userIconContainer">
              {resultList.map((result) => (
                result[0].content === answerState.content ? (
                  result.slice(0, 4).map((ans) => (
                    ans.user_id === userState.user_id ? null :
                      <UserIcon key={ans.user_id} user={{
                        first_name: ans.first_name,
                        last_name: ans.last_name,
                        department: ans.department
                      }} />
                  ))
                ) : null
              ))}
            </div>
          </div>
        </div>
      </div>
      <div className="blurResultFrame">
        <div className="resultListSummary">
          {(() => {
            let index = 0;
            for (; index < resultList.length; index++) {
              if (resultList[index][0].user_id !== null) {
                break;
              }
            }
            return (
              resultList.length - index > 6 ?
                <table>
                  <tbody>
                    {resultList.slice(index, index + 3).map((result, index) => (
                      result && result.length > 0 && (
                        <tr key={index}>
                          <td>
                            <ResultItem
                              answerList={result} isMine={result.content === answerState.content}
                            />
                          </td>
                        </tr>
                      )
                    ))}
                    <tr>
                      <td>
                        <p className="seeMore" onClick={handleDetailModalClick}>結果詳細</p>
                      </td>
                    </tr>
                    {resultList.slice(-3).map((result, index) => (
                      result && result.length > 0 && (
                        <tr key={index}>
                          <td>
                            <ResultItem
                              answerList={result} isMine={result.content === answerState.content}
                            />
                          </td>
                        </tr>
                      )
                    ))}
                  </tbody>
                </table>
                :
                <table>
                  <tbody>
                    {resultList.slice(index).map((result, index) => (
                      result && result.length > 0 && (
                        <tr key={index}>
                          <td>
                            <ResultItem
                              answerList={result} isMine={result.content === answerState.content}
                            />
                          </td>
                        </tr>
                      )
                    ))}
                  </tbody>
                </table>
            );
          })()}
        </div>
      </div>
      {isModalOpen && (
        <div className="modalOverlay" onClick={handleOutsideClick}>
          <ResultModal onClose={handleCloseModal} num={answerState.num} answerList={resultList[answerState.idx]} />
        </div>
      )}
      {isDetailModalOpen && (
        <div className="modalOverlayDetail" onClick={handleDetailOutsideClick}>
          <QResultDetailModal onClose={handleDetailCloseModal} num={answerState.num} userState={userState} answerState={answerState} resultList={resultList} />
        </div>
      )}
      {isPWModalOpen && (
        <div className={`modalOverlayPW ${isFadingOut ? 'fadeOut' : ''}`} onClick={handlePWOutsideClick}>
          <PleaseWaitModal onClose={handlePWCloseModal} />
        </div>
      )}
    </div>
  );
};

export default QResult;
