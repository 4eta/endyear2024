import React, { useState }  from 'react'
import { useLocation } from 'react-router-dom';
import '../css/common.css';
import '../css/waitingforresult.css';
import Header from '../elements/Header';
import PleaseWaitModal from '../elements/PleaseWaitModal';
import { useToQResult } from '../hooks/useToQResult';
import { useCalculateAnswer } from '../hooks/useCalculateAnswer';

const WaitingForQResult = () => {
  const { toQResult } = useToQResult();
  const { calculateAnswer } = useCalculateAnswer();
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
  const { question_id, answerState, userState, resultList } = location.state;

  console.log("WaitingForQResult.js");

  const handleSubmit = async (event) => {
    event.preventDefault();
    const status = await toQResult();
    if (status%100 === 1) {
      setIsModalOpen(true);
    } else if (status%100 === 2) {
      calculateAnswer(question_id, answerState, userState, resultList);
    }
  };

  return (
    <div className="background">
      <Header user={userState} />
      
      <div className="blur" style={{ height: '78px', top: '105px', left: '16px', position: 'absolute' }}>
        <button 
            type="submit" 
            className="btn"
            onClick={handleSubmit}>
              次へ進む ▶
          </button>
      </div>
      {isModalOpen && (
        <div className={`modalOverlay ${isFadingOut ? 'fadeOut' : ''}`} onClick={handleOutsideClick}>
          <PleaseWaitModal onClose={handleCloseModal} />
        </div>
      )}
    </div>
  );
};

export default WaitingForQResult;