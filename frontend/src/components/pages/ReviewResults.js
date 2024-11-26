import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import '../css/common.css';
import '../css/result.css';
import '../css/resultview.css';
import Header from '../elements/Header';
import UserIcon from '../elements/UserIcon';
import ResultItem from '../elements/ResultItem';
import ResultModal from '../elements/ResultModal';
import QResultDetailModal from '../elements/QResultDetailModal';
import PleaseWaitModal from '../elements/PleaseWaitModal';
import QuestionList from '../templates/QuestionList';

const ReviewResults = () => {
    const location = useLocation();
    const { question_id, answerStates, userState, resultLists } = location.state;

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
    const [isPWModalOpen, setIsPWModalOpen] = useState(false);
    const [isFadingOut, setIsFadingOut] = useState(false);
    const [id, setId] = useState(0);

    const handleToFormer = () => {
        setId((id + 5) % 6);
    }

    const handleToNext = () => {
        setId((id + 1) % 6);
    }

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

    console.log("ReviewResults");
    console.log("id", id);
    console.log("answerStates", answerStates);
    console.log("resultLists", resultLists);


    return (
        <div className="background">
            <Header user={userState} />

            <div className="qFrameResult">
                <p className="qTitleResult">Q{id} {QuestionList[id].QTitle}</p>
                <div className="toFormerQ" onClick={handleToFormer}>
                    <p className="qTitleResult">Q{(id + 5) % 6}</p>
                </div>
                <div className="toNextQ" onClick={handleToNext}>
                    <p className="qTitleResult">Q{(id + 1) % 6}</p>
                </div>
            </div>
            <div className="myResultFrame" onClick={answerStates[id].content !== null ? handleMyFrameClick : null}>
                <table>
                    <tbody>
                        <tr>
                            <td className="myAnswerIs">あなたの回答</td>
                            <td className="myAnswer">{answerStates[id].content !== null ? answerStates[id].content : '(無回答)'}</td>
                            <td className="myPoint"><span style={{ fontSize: '16px', fontWeight: '700' }}>+{answerStates[id].score !== null ? answerStates[id].score : 0}</span>Pt</td>
                        </tr>
                    </tbody>
                </table>

                <p className="myRank">
                    <span style={{ fontSize: '32px', fontWeight: '400' }}>{answerStates[id].rank !== null ? answerStates[id].rank : '-- '}</span><span style={{ fontSize: '16px', fontWeight: '700' }}>位</span><br />
                    回答者 <span style={{ fontSize: '14px', fontWeight: '700' }}>{answerStates[id].num !== 0 ? answerStates[id].num : '--'}</span>人
                </p>

                <div className="icons">
                    <div className="myIcon">
                        {answerStates[id].content !== null ? <UserIcon user={userState} /> : null}
                    </div>
                    <div className="otherIcon">
                        <div className="userIconContainer">
                            {resultLists[id].map((result) => (
                                result[0].content === answerStates[id].content ? (
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
                        for (; index < resultLists[id].length; index++) {
                            if (resultLists[id][index][0].user_id !== null) {
                                break;
                            }
                        }
                        return (
                            resultLists[id].length - index > 6 ?
                                <table>
                                    <tbody>
                                        {resultLists[id].slice(index, index + 3).map((result, index) => (
                                            result && result.length > 0 && (
                                                <tr key={index}>
                                                    <td>
                                                        <ResultItem
                                                            answerList={result} isMine={result.content === answerStates[id].content}
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
                                        {resultLists[id].slice(-3).map((result, index) => (
                                            result && result.length > 0 && (
                                                <tr key={index}>
                                                    <td>
                                                        <ResultItem
                                                            answerList={result} isMine={result.content === answerStates[id].content}
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
                                        {resultLists[id].slice(index).map((result, index) => (
                                            result && result.length > 0 && (
                                                <tr key={index}>
                                                    <td>
                                                        <ResultItem
                                                            answerList={result} isMine={result.content === answerStates[id].content}
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
                    <ResultModal onClose={handleCloseModal} num={answerStates[id].num} answerList={resultLists[id][answerStates[id].idx]} />
                </div>
            )}
            {isDetailModalOpen && (
                <div className="modalOverlayDetail" onClick={handleDetailOutsideClick}>
                    <QResultDetailModal onClose={handleDetailCloseModal} num={answerStates[id].num} userState={userState} answerState={answerStates[id]} resultList={resultLists[id]} />
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

export default ReviewResults;
