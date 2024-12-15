import React, { useState, useRef, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useToWaitingForQResult } from '../hooks/useToWaitingForQResult';
import { useSubmitAnswer } from '../hooks/useSubmitAnswer';
import { useCalculateAnswer } from '../hooks/useCalculateAnswer';
import '../css/common.css';
import '../css/question.css';
import Header from '../elements/Header';
import AnswerList from '../templates/AnswerList';
import QuestionList from '../templates/QuestionList';

const QAsk = () => {
  const { submitAnswer } = useSubmitAnswer();
  const { toWaitingForQResult } = useToWaitingForQResult();
  const { calculateAnswer } = useCalculateAnswer();

  const location = useLocation();
  const navigate = useNavigate();
  const { answerState, userState, question_id } = location.state;
  const [isFocused, setIsFocused] = useState(false);
  const [ansStatus, setAnsStatus] = useState(-1); //入力前の状態:-1
  const [answer, setAnswer] = useState('');
  const ansBlurRef = useRef(null);

  const handleValidationCheck = (event) => {
    event.preventDefault();

    if (answer.trim() === '') {
      setAnsStatus(-1);
    } else if (AnswerList[question_id].some(ans => ans.toLowerCase() === answer.toLowerCase())) {
      setAnsStatus(1);
    } else {
      setAnsStatus(0);
    }
  };

  const toggleFocus = () => {
    setIsFocused(true);
  };

  const handleClickOutside = (event) => {
    if (ansBlurRef.current && !ansBlurRef.current.contains(event.target)) {
      setIsFocused(false);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const matchedAnswer = AnswerList[question_id].find(ans => ans.toLowerCase() === answer.toLowerCase());
    if (matchedAnswer) {
      const status = await toWaitingForQResult();
      if (status % 100 === 1 && Math.floor(status / 100) === question_id) {
        submitAnswer(question_id, matchedAnswer, answerState, userState);
      } else if (status % 100 === 1) {
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
        )
      }
    } else {
      setAnsStatus(0);
    }

  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  console.log("QAsk.js");
  console.log("answerState", answerState);
  console.log("userState", userState);


  return (
    <div className="background">
      <Header user={userState} />

      <div className={`qFrame ${isFocused ? 'inputMode' : ''}`}>
        <p className="qNumber">Q{question_id}</p>
        <div className="qLine"></div>
        <p className="qTitle">{QuestionList[question_id].QTitle}</p>
        <p className="ansNumber"><span>{QuestionList[question_id].ansNumber}</span>個</p>
      </div>
      <div className={`explainFrame ${isFocused ? 'inputMode' : ''}`}>
        <p className="ansExample">回答例<span>「{QuestionList[question_id].ansExample}」</span></p>
        <p dangerouslySetInnerHTML={{ __html: QuestionList[question_id].notion }} />
      </div>
      <div
        className={`ansBlur ${isFocused ? 'inputMode' : ''} ${ansStatus === 1 ? 'valid' : ''}`}
        onClick={toggleFocus}
        ref={ansBlurRef}
      >
        <form>
          <input
            type="text"
            placeholder="回答を入力..."
            className="ansInputForm"
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            onKeyDown={handleKeyPress}
          />
          <div className="ansButton" onClick={handleValidationCheck}>
            <img src={`${process.env.PUBLIC_URL}/arrowrightwhite.png`} alt="Arrow Right" />
          </div>
        </form>
        <div className={`validationMessage ${ansStatus === 0 ? 'alert' : ''}`}>
          <p>不適な回答です</p>
        </div>
        <button className="btn" onClick={handleSubmit}>
          提出する
        </button>
      </div>
    </div>
  );
};

export default QAsk;
