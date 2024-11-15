import React, { useState, useEffect } from 'react';
import '../css/common.css';
import '../css/resultdetail.css';
import ResultItem from './ResultItem';
import ResultModal from './ResultModal';

const QResultDetailModal = ({ num, userState, answerState, resultList, onClose }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [animationClass, setAnimationClass] = useState('fadeIn');

  useEffect(() => {
    setAnimationClass('fadeIn');
  }, []);

  const handleCloseModal = () => {
    setAnimationClass('fadeOut');
    setTimeout(() => {
      setIsModalOpen(false);
      onClose();
    }, 500);
  };

  const handleOutsideClick = (e) => {
    if (e.target.className.includes('modalOverlay')) {
      handleCloseModal();
    }
  };

  console.log("QResultDetailModal.js");

  return (
    <div className={`background ${animationClass}`}>
      <div className="blurResultDetailFrame">
        <div className="resultList scrollable">
          <table>
            <tbody>
              {resultList.map((result, index) => (
                result && result.length > 0 && (
                  <tr key={index}>
                    <td>
                      <ResultItem 
                        answerList={result} isMine={result[0].content === answerState.content}
                      />
                    </td>
                  </tr>
                )
              ))}
            </tbody>
          </table>
        </div>
        <div className="backButton">
          <img 
            src={`${process.env.PUBLIC_URL}/batsu.svg`} 
            className="batsuIcon" 
            alt="batsu" 
            onClick={handleCloseModal}
          />
        </div>
      </div>
      {isModalOpen && (
        <div className="modalOverlay" onClick={handleOutsideClick}>
          <ResultModal onClose={handleCloseModal} num={answerState.num} answerList={resultList[answerState.idx]}/>
        </div>
      )}
    </div>
  );
};

export default QResultDetailModal;
