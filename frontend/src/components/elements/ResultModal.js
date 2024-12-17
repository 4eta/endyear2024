import React from 'react';
import '../css/resultmodal.css';
import UserIcon from './UserIcon';

const ResultModal = ({ answerList }) => {

  const num = answerList.length;
  // UserIconをnumの数だけ生成
  const userIcons = Array.from({ length: num }, (_, index) => (
    <UserIcon key={index} user={answerList[index]} />
  ));

  // 1行5列に分割
  const rows = [];
  for (let i = 0; i < userIcons.length; i += 5) {
    rows.push(userIcons.slice(i, i + 5));
  }

  // 行数に基づいて高さを計算
  const frameHeight = 124 + (rows.length - 1) * 55;

  return (
    <div className="resultModal" style={{ background: 'transparent', height: '100px', left: 'calc(50% - 171.5px)' }}>
      <div className="resultFrameModal">
        <table>
          <colgroup>
            <col style={{ width: '60px' }} />
            <col style={{ width: '223px' }} />
            <col style={{ width: '60px' }} />
          </colgroup>
          <tbody>
            <tr>
              <td className="rankModal">
                <span style={{ fontSize: '20px', fontWeight: '700' }}>{answerList[0].rank}</span>位
              </td>
              <td className="answerModal">
                {answerList[0].content}
              </td>
              <td className="pointModal">
                <p><span style={{ fontSize: '16px', fontWeight: '700' }}>{answerList[0].score}</span>pt</p>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div className="resultUserFrameModal" style={{ height: `${frameHeight}px` }}>
        <p className="answerUser">回答者 <span style={{ fontSize: '14px', fontWeight: '700' }}>{num}</span>人</p>
        <div className="answerUserList">
          <table>
            <tbody>
              {rows.map((row, rowIndex) => (
                <tr key={rowIndex}>
                  {row.map((icon, colIndex) => (
                    <td key={colIndex}>{icon}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ResultModal;