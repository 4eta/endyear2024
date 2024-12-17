import React, { useState } from 'react';
import '../css/resultitem.css';
import UserIcon from './UserIcon';
import ResultModal from './ResultModal';

const ResultItem = ({ answerList, isMine }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isFadingOut, setIsFadingOut] = useState(false);

  const handleItemClick = () => {
    if (answerList[0].user_id !== null) {
      setIsModalOpen(true);
    }
  };

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

  return (
    <div>
      <div className="resultItemFrame" onClick={handleItemClick}>
        <table>
          <tbody>
            <tr>
              <td style={{ width: '60px', height: '46px' }}>
                {/* <div className="resultNumFrame" style={isMine ? { background: '#3bb9c1' } : answerList[0].user_id === null ? { background: '#bbbbbb' } : {}}> */}
                <div className={`resultNumFrame${isMine ? ' isMine' : ''}${answerList.length === 1 ? ' is1st' : ''}`} style={answerList[0].user_id === null ? { background: '#bbbbbb' } : {}}>
                  <div className="onlyOneCrown">
                    <img
                      src={`${process.env.PUBLIC_URL}/crown.png`}
                      alt="Crown"
                      style={{ visibility: answerList[0].user_id !== null && answerList.length === 1 ? 'visible' : 'hidden' }}
                    />
                  </div>
                  <div className="resultNum">
                    <span style={{ fontSize: '20px', fontWeight: '700' }}>{answerList[0].user_id === null ? 0 : answerList.length}</span>人
                  </div>
                </div>
              </td>
              <td className="answerWord">
                {answerList[0].content}
              </td>
              <td className="onlyOneItem" style={{ visibility: answerList.length === 1 ? 'visible' : 'hidden' }}>
                <UserIcon user={answerList[0]} />
              </td>
              <td className="answerPoint">
                <span style={{ fontSize: '16px', fontWeight: '700' }}>{answerList[0].score}</span>pt
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      {
        isModalOpen && (
          <div className={`modalOverlay ${isFadingOut ? 'fadeOut' : ''}`} onClick={handleOutsideClick}>
            <ResultModal onClose={handleCloseModal} num={answerList.length} answerList={answerList} />
          </div>
        )
      }
    </div >
  );
};

export default ResultItem;
